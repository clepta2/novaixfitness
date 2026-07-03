"""
Download de todos os modelos MarianMT pré-quantizados INT8 para PT
Fonte: HuggingFace (R4kSo1997)

Modelos disponíveis:
- pt-en, en-pt (já baixados)
- ca-pt (Catalan → Português)

Uso: python scripts/download_all_pt_models.py
"""

import os
import hashlib
from huggingface_hub import hf_hub_download

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

# Modelos pré-quantizados disponíveis
MODELS = {
    "pt-en": {
        "repo": "R4kSo1997/opus-mt-pt-en-onnx-int8",
        "files": [
            "encoder_model_quantized.onnx",
            "decoder_model_quantized.onnx",
            "tokenizer.json",
            "config.json",
        ],
    },
    "en-pt": {
        "repo": "R4kSo1997/opus-mt-en-pt-onnx-int8",
        "files": [
            "encoder_model_quantized.onnx",
            "decoder_model_quantized.onnx",
            "tokenizer.json",
            "config.json",
        ],
    },
    "ca-pt": {
        "repo": "R4kSo1997/opus-mt-ca-pt-onnx-int8",
        "files": [
            "encoder_model_quantized.onnx",
            "decoder_model_quantized.onnx",
            "tokenizer.json",
            "config.json",
        ],
    },
}

def calculate_sha256(filepath):
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def download_model(pair_id, config):
    print(f"\n{'='*60}")
    print(f"Baixando: {pair_id} ({config['repo']})")
    print(f"{'='*60}")

    output_dir = os.path.join(OUTPUT_DIR, pair_id)
    os.makedirs(output_dir, exist_ok=True)

    results = []

    for filename in config["files"]:
        print(f"\n  Baixando {filename}...")
        try:
            local_path = hf_hub_download(
                repo_id=config["repo"],
                filename=filename,
                local_dir=output_dir,
            )

            file_size = os.path.getsize(local_path) / 1024 / 1024
            sha256 = calculate_sha256(local_path)

            print(f"  ✓ {filename}: {file_size:.1f}MB (SHA-256: {sha256[:16]}...)")

            results.append({
                "file": filename,
                "size_mb": file_size,
                "sha256": sha256,
                "path": local_path,
            })
        except Exception as e:
            print(f"  ✗ ERRO ao baixar {filename}: {e}")
            return None

    total_size = sum(r["size_mb"] for r in results)
    print(f"\n  Tamanho total: {total_size:.1f}MB")

    return {
        "pair": pair_id,
        "total_size_mb": total_size,
        "files": results,
    }

def main():
    print("=" * 60)
    print("NOVAIX Fitness - Download de Modelos Pré-Quantizados")
    print("=" * 60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_results = []

    for pair_id, config in MODELS.items():
        try:
            result = download_model(pair_id, config)
            if result:
                all_results.append(result)
        except Exception as e:
            print(f"\nERRO FATAL ao baixar {pair_id}: {e}")

    # Resumo
    print("\n" + "=" * 60)
    print("RESUMO")
    print("=" * 60)

    total_download = 0
    for r in all_results:
        print(f"\n{r['pair']}:")
        print(f"  Tamanho total: {r['total_size_mb']:.1f}MB")
        total_download += r['total_size_mb']

    print(f"\nTotal geral: {total_download:.1f}MB")

    print("\n" + "=" * 60)
    print("URLs PARA O R2")
    print("=" * 60)

    for r in all_results:
        decoder = next((f for f in r["files"] if "decoder_model" in f["file"]), None)
        encoder = next((f for f in r["files"] if "encoder_model" in f["file"]), None)

        from_id, to_id = r["pair"].split("-")

        print(f"""
  '{r["pair"]}': {{
    id: '{r["pair"]}',
    from: '{from_id}',
    to: '{to_id}',
    encoderUrl: `${{BASE_URL}}/{r["pair"]}/encoder_model_quantized.onnx`,
    decoderUrl: `${{BASE_URL}}/{r["pair"]}/decoder_model_quantized.onnx`,
    tokenizerUrl: `${{BASE_URL}}/{r["pair"]}/tokenizer.json`,
    encoderSize: {int(encoder["size_mb"] * 1024 * 1024) if encoder else 0},
    decoderSize: {int(decoder["size_mb"] * 1024 * 1024) if decoder else 0},
    version: '1.0.0',
  }},""")

    print(f"\n✅ Download concluído! {len(all_results)}/{len(MODELS)} pares baixados.")
    print(f"   Modelos salvos em: {os.path.abspath(OUTPUT_DIR)}")

if __name__ == "__main__":
    main()
