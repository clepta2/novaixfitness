"""
Script simplificado de conversão MarianMT → ONNX Quantizado INT8
Usa PyTorch diretamente (sem optimum)

Uso: python scripts/convert_onnx_simple.py
"""

import os
import sys
import hashlib
import shutil
import torch
from transformers import MarianMTModel, MarianTokenizer

# Configuração
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODELS = {
    "pt-en": "Helsinki-NLP/opus-mt-pt-en",
    "en-pt": "Helsinki-NLP/opus-mt-en-pt",
    "pt-es": "Helsinki-NLP/opus-mt-pt-es",
    "es-pt": "Helsinki-NLP/opus-mt-es-pt",
}

def calculate_sha256(filepath):
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def export_to_onnx(model, tokenizer, output_dir):
    """Exporta modelo para ONNX"""
    model.eval()

    # Criar input dummy
    dummy_text = "Olá, como vai?"
    inputs = tokenizer(dummy_text, return_tensors="pt", padding=True, truncation=True)

    # Exportar encoder
    encoder_path = os.path.join(output_dir, "encoder_model.onnx")
    torch.onnx.export(
        model.get_encoder(),
        (inputs["input_ids"], inputs["attention_mask"]),
        encoder_path,
        input_names=["input_ids", "attention_mask"],
        output_names=["last_hidden_state"],
        dynamic_axes={
            "input_ids": {0: "batch_size", 1: "sequence_length"},
            "attention_mask": {0: "batch_size", 1: "sequence_length"},
            "last_hidden_state": {0: "batch_size", 1: "sequence_length"},
        },
        opset_version=14,
    )
    print(f"   Encoder exportado: {os.path.getsize(encoder_path) / 1024 / 1024:.1f}MB")

    # Exportar decoder
    decoder_path = os.path.join(output_dir, "decoder_model.onnx")
    decoder = model.get_decoder()
    decoder.eval()

    # Decoder inputs
    decoder_input_ids = torch.zeros((1, 1), dtype=torch.long)
    encoder_hidden_states = torch.randn((1, 10, model.config.d_model))
    decoder_attention_mask = torch.ones((1, 10), dtype=torch.long)

    torch.onnx.export(
        decoder,
        (decoder_input_ids, encoder_hidden_states, decoder_attention_mask),
        decoder_path,
        input_names=["input_ids", "encoder_hidden_states", "attention_mask"],
        output_names=["last_hidden_state"],
        dynamic_axes={
            "input_ids": {0: "batch_size", 1: "decoder_sequence_length"},
            "encoder_hidden_states": {0: "batch_size", 1: "encoder_sequence_length"},
            "attention_mask": {0: "batch_size", 1: "encoder_sequence_length"},
            "last_hidden_state": {0: "batch_size", 1: "decoder_sequence_length"},
        },
        opset_version=14,
    )
    print(f"   Decoder exportado: {os.path.getsize(decoder_path) / 1024 / 1024:.1f}MB")

def quantize_onnx_model(input_path, output_path):
    """Quantiza modelo ONNX para INT8"""
    from onnxruntime.quantization import quantize_dynamic, QuantType

    quantize_dynamic(
        model_input=input_path,
        model_output=output_path,
        weight_type=QuantType.QInt8,
    )
    print(f"   Quantizado: {os.path.getsize(output_path) / 1024 / 1024:.1f}MB")

def convert_model(model_id, hf_name, output_dir):
    print(f"\n{'='*60}")
    print(f"Convertendo: {hf_name} → {model_id}")
    print(f"{'='*60}")

    # 1. Carregar modelo
    print("\n[1/4] Carregando modelo...")
    try:
        tokenizer = MarianTokenizer.from_pretrained(hf_name)
        model = MarianMTModel.from_pretrained(hf_name)
        model.eval()
        print(f"   Modelo carregado: {hf_name}")
    except Exception as e:
        print(f"   ERRO ao carregar: {e}")
        return None

    # 2. Exportar para ONNX
    print("\n[2/4] Exportando para ONNX...")
    raw_dir = os.path.join(output_dir, f"{model_id}-raw")
    os.makedirs(raw_dir, exist_ok=True)

    try:
        export_to_onnx(model, tokenizer, raw_dir)
        tokenizer.save_pretrained(raw_dir)
    except Exception as e:
        print(f"   ERRO ao exportar: {e}")
        import traceback
        traceback.print_exc()
        shutil.rmtree(raw_dir, ignore_errors=True)
        return None

    # 3. Quantizar
    print("\n[3/4] Quantizando para INT8...")
    quant_dir = os.path.join(output_dir, model_id)
    os.makedirs(quant_dir, exist_ok=True)

    try:
        for f in ["encoder_model.onnx", "decoder_model.onnx"]:
            input_path = os.path.join(raw_dir, f)
            output_path = os.path.join(quant_dir, f)
            if os.path.exists(input_path):
                quantize_onnx_model(input_path, output_path)
    except Exception as e:
        print(f"   ERRO ao quantizar: {e}")
        import traceback
        traceback.print_exc()
        shutil.rmtree(quant_dir, ignore_errors=True)
        shutil.rmtree(raw_dir, ignore_errors=True)
        return None

    # Copiar tokenizer e configs
    for f in os.listdir(raw_dir):
        if not f.endswith(".onnx"):
            src = os.path.join(raw_dir, f)
            dst = os.path.join(quant_dir, f)
            if os.path.isfile(src):
                shutil.copy2(src, dst)

    # 4. Verificar resultado
    print("\n[4/4] Verificando resultado...")
    quant_size = sum(
        os.path.getsize(os.path.join(quant_dir, f))
        for f in os.listdir(quant_dir)
        if f.endswith(".onnx")
    ) / 1024 / 1024

    raw_size = sum(
        os.path.getsize(os.path.join(raw_dir, f))
        for f in os.listdir(raw_dir)
        if f.endswith(".onnx")
    ) / 1024 / 1024

    print(f"   Tamanho bruto: {raw_size:.1f}MB")
    print(f"   Tamanho quantizado: {quant_size:.1f}MB")
    print(f"   Redução: {(1 - quant_size/raw_size)*100:.0f}%")

    # SHA-256
    decoder_path = os.path.join(quant_dir, "decoder_model.onnx")
    sha256 = calculate_sha256(decoder_path) if os.path.exists(decoder_path) else ""
    if sha256:
        print(f"   SHA-256: {sha256[:16]}...")

    # Limpar raw
    shutil.rmtree(raw_dir, ignore_errors=True)

    return {
        "id": model_id,
        "size_mb": quant_size,
        "sha256": sha256,
        "path": quant_dir,
    }

def main():
    print("=" * 60)
    print("NOVAIX Fitness - Conversão MarianMT → ONNX INT8")
    print("(Versão simplificada sem optimum)")
    print("=" * 60)

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
        print(f"  SHA-256: {r['sha256'][:32] if r['sha256'] else 'N/A'}...")
        print(f"  Caminho: {r['path']}")

    # Config para o app
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
