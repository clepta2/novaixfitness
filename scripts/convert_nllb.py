"""
Conversão NLLB-200 (Facebook) → ONNX Quantizado INT8
Suporta PT, EN, ES nativamente

Modelo: facebook/nllb-200-distilled-600M
Tamanho bruto: ~2.5GB (600M params)
Tamanho quantizado INT8: ~600MB

Uso: python scripts/convert_nllb.py
"""

import os
import sys
import hashlib
import shutil
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Configuração
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_ID = "facebook/nllb-200-distilled-600M"

# Mapeamento de idiomas NLLB
NLLB_LANGS = {
    "pt": "por_Latn",
    "en": "eng_Latn",
    "es": "spa_Latn",
}

# Pares de tradução
TRANSLATION_PAIRS = [
    ("pt", "en"),
    ("en", "pt"),
    ("pt", "es"),
    ("es", "pt"),
]

def calculate_sha256(filepath):
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def export_to_onnx(model, tokenizer, output_dir):
    """Exporta modelo NLLB para ONNX"""
    model.eval()

    # Input dummy
    dummy_text = "Olá, como vai?"
    inputs = tokenizer(
        dummy_text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        src_lang="por_Latn",
    )

    # Exportar modelo completo (encoder + decoder merged)
    merged_path = os.path.join(output_dir, "decoder_model_merged.onnx")

    # Para NLLB, o modelo já é um decoder-only com cross-attention
    # Vamos exportar o modelo completo
    print("   Exportando modelo completo...")

    try:
        # Exportar com dummy inputs
        torch.onnx.export(
            model,
            (
                inputs["input_ids"],
                inputs["attention_mask"],
            ),
            merged_path,
            input_names=["input_ids", "attention_mask"],
            output_names=["logits"],
            dynamic_axes={
                "input_ids": {0: "batch_size", 1: "sequence_length"},
                "attention_mask": {0: "batch_size", 1: "sequence_length"},
                "logits": {0: "batch_size", 1: "sequence_length"},
            },
            opset_version=14,
            do_constant_folding=True,
        )
        print(f"   Modelo exportado: {os.path.getsize(merged_path) / 1024 / 1024:.1f}MB")
        return True
    except Exception as e:
        print(f"   ERRO na exportação: {e}")
        import traceback
        traceback.print_exc()
        return False

def quantize_onnx(input_path, output_path):
    """Quantiza modelo ONNX para INT8"""
    from onnxruntime.quantization import quantize_dynamic, QuantType

    print("   Quantizando para INT8...")
    quantize_dynamic(
        model_input=input_path,
        model_output=output_path,
        weight_type=QuantType.QInt8,
    )
    print(f"   Quantizado: {os.path.getsize(output_path) / 1024 / 1024:.1f}MB")

def main():
    print("=" * 60)
    print("NOVAIX Fitness - Conversão NLLB → ONNX INT8")
    print(f"Modelo: {MODEL_ID}")
    print("=" * 60)

    # Criar diretório
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. Carregar modelo
    print("\n[1/4] Carregando modelo NLLB...")
    print("   Isso pode demorar alguns minutos (modelo ~600MB)...")
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID)
        model.eval()
        print(f"   Modelo carregado com sucesso!")
    except Exception as e:
        print(f"   ERRO ao carregar modelo: {e}")
        import traceback
        traceback.print_exc()
        return

    # 2. Exportar para ONNX
    print("\n[2/4] Exportando para ONNX...")
    raw_dir = os.path.join(OUTPUT_DIR, "nllb-raw")
    os.makedirs(raw_dir, exist_ok=True)

    # Salvar tokenizer
    tokenizer.save_pretrained(raw_dir)

    if not export_to_onnx(model, tokenizer, raw_dir):
        print("   Falha na exportação. Abortando.")
        shutil.rmtree(raw_dir, ignore_errors=True)
        return

    # 3. Quantizar
    print("\n[3/4] Quantizando para INT8...")
    quant_dir = os.path.join(OUTPUT_DIR, "nllb-200-distilled-600M")
    os.makedirs(quant_dir, exist_ok=True)

    try:
        raw_path = os.path.join(raw_dir, "decoder_model_merged.onnx")
        quant_path = os.path.join(quant_dir, "decoder_model_merged.onnx")
        quantize_onnx(raw_path, quant_path)
    except Exception as e:
        print(f"   ERRO ao quantizar: {e}")
        import traceback
        traceback.print_exc()
        shutil.rmtree(quant_dir, ignore_errors=True)
        shutil.rmtree(raw_dir, ignore_errors=True)
        return

    # Copiar tokenizer e configs
    for f in os.listdir(raw_dir):
        if not f.endswith(".onnx"):
            src = os.path.join(raw_dir, f)
            dst = os.path.join(quant_dir, f)
            if os.path.isfile(src):
                shutil.copy2(src, dst)

    # 4. Verificar resultado
    print("\n[4/4] Verificando resultado...")
    raw_size = os.path.getsize(raw_path) / 1024 / 1024
    quant_size = os.path.getsize(quant_path) / 1024 / 1024

    print(f"   Tamanho bruto: {raw_size:.1f}MB")
    print(f"   Tamanho quantizado: {quant_size:.1f}MB")
    print(f"   Redução: {(1 - quant_size/raw_size)*100:.0f}%")

    # SHA-256
    sha256 = calculate_sha256(quant_path)
    print(f"   SHA-256: {sha256[:32]}...")

    # Limpar raw
    shutil.rmtree(raw_dir, ignore_errors=True)

    # Resumo
    print("\n" + "=" * 60)
    print("CONVERSÃO CONCLUÍDA!")
    print("=" * 60)
    print(f"\nModelo quantizado: {quant_dir}")
    print(f"Tamanho final: {quant_size:.1f}MB")
    print(f"SHA-256: {sha256}")

    # Config para o app
    print("\n" + "=" * 60)
    print("CONFIG PARA src/ml/models-config.ts")
    print("=" * 60)
    print(f"""
const NLLB_BASE_URL = 'https://cdn.novaixfitness.com/models/nllb-200-distilled-600M';

export const MODEL_CONFIGS = {{
  'pt-en': {{
    id: 'pt-en',
    from: 'pt',
    to: 'en',
    url: `${{NLLB_BASE_URL}}/decoder_model_merged.onnx`,
    expectedSize: {int(quant_size * 1024 * 1024)},
    expectedHash: '{sha256}',
    version: '1.0.0',
    nllb_srcLang: 'por_Latn',
    nllb_tgtLang: 'eng_Latn',
  }},
  'en-pt': {{
    id: 'en-pt',
    from: 'en',
    to: 'pt',
    url: `${{NLLB_BASE_URL}}/decoder_model_merged.onnx`,
    expectedSize: {int(quant_size * 1024 * 1024)},
    expectedHash: '{sha256}',
    version: '1.0.0',
    nllb_srcLang: 'eng_Latn',
    nllb_tgtLang: 'por_Latn',
  }},
  'pt-es': {{
    id: 'pt-es',
    from: 'pt',
    to: 'es',
    url: `${{NLLB_BASE_URL}}/decoder_model_merged.onnx`,
    expectedSize: {int(quant_size * 1024 * 1024)},
    expectedHash: '{sha256}',
    version: '1.0.0',
    nllb_srcLang: 'por_Latn',
    nllb_tgtLang: 'spa_Latn',
  }},
  'es-pt': {{
    id: 'es-pt',
    from: 'es',
    to: 'pt',
    url: `${{NLLB_BASE_URL}}/decoder_model_merged.onnx`,
    expectedSize: {int(quant_size * 1024 * 1024)},
    expectedHash: '{sha256}',
    version: '1.0.0',
    nllb_srcLang: 'spa_Latn',
    nllb_tgtLang: 'por_Latn',
  }},
}};
""")

    print("Próximos passos:")
    print("1. Upload do modelo para CDN")
    print("2. Atualizar URLs em src/ml/models-config.ts")
    print("3. Testar tradução no app")

if __name__ == "__main__":
    main()
