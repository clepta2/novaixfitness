"""
Upload dos modelos para Cloudflare R2
Compatível com AWS S3 API

Uso: python scripts/upload_r2.py --account-id XXX --access-key XXX --secret-key XXX
"""

import os
import sys
import argparse
import subprocess

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
BUCKET_NAME = "diffstore"

def upload_models(account_id, access_key, secret_key):
    endpoint = f"https://{account_id}.r2.cloudflarestorage.com"

    # Configurar credenciais via environment
    env = os.environ.copy()
    env["AWS_ACCESS_KEY_ID"] = access_key
    env["AWS_SECRET_ACCESS_KEY"] = secret_key
    env["AWS_DEFAULT_REGION"] = "auto"

    # Listar pares disponíveis
    pairs = [d for d in os.listdir(MODELS_DIR) if os.path.isdir(os.path.join(MODELS_DIR, d))]

    print(f"Pares encontrados: {pairs}")
    print(f"Bucket: {BUCKET_NAME}")
    print(f"Endpoint: {endpoint}")
    print()

    for pair in pairs:
        pair_dir = os.path.join(MODELS_DIR, pair)
        files = [f for f in os.listdir(pair_dir) if f.endswith(('.onnx', '.json')) and not f.startswith('.')]

        print(f"Uploading {pair} ({len(files)} arquivos)...")

        for filename in files:
            local_path = os.path.join(pair_dir, filename)
            s3_key = f"{pair}/{filename}"
            file_size = os.path.getsize(local_path) / 1024 / 1024

            print(f"  {filename} ({file_size:.1f}MB)...", end=" ", flush=True)

            result = subprocess.run(
                [
                    "aws", "s3", "cp",
                    local_path,
                    f"s3://{BUCKET_NAME}/{s3_key}",
                    "--endpoint-url", endpoint,
                    "--quiet",
                ],
                env=env,
                capture_output=True,
                text=True,
            )

            if result.returncode == 0:
                print("OK")
            else:
                print(f"ERRO: {result.stderr}")

        print()

    # Gerar URLs públicas
    print("=" * 60)
    print("URLS DOS MODELOS (após ativar Public Access no R2)")
    print("=" * 60)
    print()

    public_base = f"https://{BUCKET_NAME}.{account_id}.r2.dev"

    for pair in pairs:
        print(f"'{pair}': {{")
        print(f"  id: '{pair}',")
        print(f"  from: '{pair.split('-')[0]}',")
        print(f"  to: '{pair.split('-')[1]}',")
        print(f"  encoderUrl: '{public_base}/{pair}/encoder_model_quantized.onnx',")
        print(f"  decoderUrl: '{public_base}/{pair}/decoder_model_quantized.onnx',")
        print(f"  tokenizerUrl: '{public_base}/{pair}/tokenizer.json',")
        print(f"}},")
        print()

def main():
    parser = argparse.ArgumentParser(description="Upload modelos para Cloudflare R2")
    parser.add_argument("--account-id", required=True, help="Cloudflare Account ID")
    parser.add_argument("--access-key", required=True, help="R2 Access Key ID")
    parser.add_argument("--secret-key", required=True, help="R2 Secret Access Key")
    args = parser.parse_args()

    upload_models(args.account_id, args.access_key, args.secret_key)

if __name__ == "__main__":
    main()
