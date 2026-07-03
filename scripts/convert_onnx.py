"""
Script de conversão MarianMT → ONNX Quantizado INT8
Para o app NOVAIX Fitness

Uso: python scripts/convert_onnx.py
"""

import os
import sys
import hashlib
import shutil

# Configuração
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODELS = {
    "pt-en": "Helsinki-NLP/opus-mt-pt-en",
    "en-pt": "Helsinki-NLP/opus-mt-en-pt",
    "pt-es": "Helsinki-NLP/opus-mt-pt-es",
    "es-pt": "Helsinki-NLP/opus-mt-es-pt",
}

def calculate_sha256(filepath):
    """Calcula SHA-256 de um arquivo"""
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def convert_model(model_id, hf_name, output_dir):
    """Converte um modelo para ONNX quantizado INT8"""
    from optimum.onnxruntime import ORTModelForSeq2SeqLM, ORTQuantizer
    from optimum.onnxruntime.configuration import AutoQuantizationConfig
    from transformers import AutoTokenizer

    print(f"\n{'='*60}")
    print(f"Convertendo: {hf_name} → {model_id}")
    print(f"{'='*60}")

    # 1. Exportar para ONNX
    print("\n[1/3] Exportando para ONNX...")
    try:
        model = ORTModelForSeq2SeqLM.from_pretrained(hf_name, export=True)
        tokenizer = AutoTokenizer.from_pretrained(hf_name)
    except Exception as e:
        print(f"   ERRO ao exportar: {e}")
        return None

    # Salvar modelo ONNX bruto (temporário)
    onnx_temp_dir = os.path.join(output_dir, f"{model_id}-raw")
    os.makedirs(onnx_temp_dir, exist_ok=True)
    model.save_pretrained(onnx_temp_dir)
    tokenizer.save_pretrained(onnx_temp_dir)

    # Calcular tamanho do ONNX bruto
    raw_size = sum(
        os.path.getsize(os.path.join(onnx_temp_dir, f))
        for f in os.listdir(onnx_temp_dir)
        if f.endswith(".onnx")
    ) / 1024 / 1024
    print(f"   ONNX bruto: {raw_size:.1f}MB")

    # 2. Quantizar para INT8
    print("\n[2/3] Quantizando para INT8...")
    try:
        quantizer = ORTQuantizer.from_pretrained(model)

        quant_dir = os.path.join(output_dir, model_id)
        os.makedirs(quant_dir, exist_ok=True)

        # Configurar quantização INT8
        qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False)

        quantizer.quantize(
            save_dir=quant_dir,
            quantization_config=qconfig,
        )

        # Salvar tokenizer junto
        tokenizer.save_pretrained(quant_dir)
    except Exception as e:
        print(f"   ERRO ao quantizar: {e}")
        # Limpar diretório temporário
        shutil.rmtree(onnx_temp_dir, ignore_errors=True)
        return None

    # 3. Verificar resultado
    print("\n[3/3] Verificando resultado...")
    quant_size = sum(
        os.path.getsize(os.path.join(quant_dir, f))
        for f in os.listdir(quant_dir)
        if f.endswith(".onnx")
    ) / 1024 / 1024

    print(f"   Quantizado: {quant_size:.1f}MB")
    print(f"   Redução: {(1 - quant_size/raw_size)*100:.0f}%")

    # Calcular SHA-256 do decoder (modelo principal)
    decoder_path = None
    for f in os.listdir(quant_dir):
        if "decoder" in f and f.endswith(".onnx") and "merged" not in f:
            decoder_path = os.path.join(quant_dir, f)
            break
    if not decoder_path:
        # Fallback para qualquer .onnx
        for f in os.listdir(quant_dir):
            if f.endswith(".onnx"):
                decoder_path = os.path.join(quant_dir, f)
                break

    sha256 = ""
    if decoder_path:
        sha256 = calculate_sha256(decoder_path)
        print(f"   SHA-256: {sha256[:16]}...")

    # Limpar diretório raw
    shutil.rmtree(onnx_temp_dir, ignore_errors=True)

    return {
        "id": model_id,
        "size_mb": quant_size,
        "sha256": sha256,
        "path": quant_dir,
    }

def main():
    print("=" * 60)
    print("NOVAIX Fitness - Conversão MarianMT → ONNX INT8")
    print("=" * 60)

    # Criar diretório de saída
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    results = []

    for model_id, hf_name in MODELS.items():
        try:
            result = convert_model(model_id, hf_name, OUTPUT_DIR)
            if result:
                results.append(result)
        except Exception as e:
            print(f"\nERRO FATAL ao converter {model_id}: {e}")
            import traceback
            traceback.print_exc()

    # Resumo
    print("\n" + "=" * 60)
    print("RESUMO DA CONVERSÃO")
    print("=" * 60)

    for r in results:
        print(f"\n{r['id']}:")
        print(f"  Tamanho: {r['size_mb']:.1f}MB")
        print(f"  SHA-256: {r['sha256'][:32]}...")
        print(f"  Caminho: {r['path']}")

    # Gerar config para o app
    print("\n" + "=" * 60)
    print("CONFIG PARA src/ml/models-config.ts")
    print("=" * 60)

    for r in results:
        from_id, to_id = r["id"].split("-")
        print(f"""
  '{r["id"]}': {{
    id: '{r["id"]}',
    from: '{from_id}',
    to: '{to_id}',
    url: `${{BASE_URL}}/{r["id"]}/decoder_model.onnx`,
    expectedSize: {int(r["size_mb"] * 1024 * 1024)},
    expectedHash: '{r["sha256"]}',
    version: '1.0.0',
  }},""")

    print(f"\n✅ Conversão concluída! {len(results)}/{len(MODELS)} modelos convertidos.")
    print(f"   Modelos salvos em: {os.path.abspath(OUTPUT_DIR)}")

if __name__ == "__main__":
    main()
