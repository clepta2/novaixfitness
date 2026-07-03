"""
Upload dos modelos para Cloudflare R2 usando boto3
"""

import os
import boto3
from botocore.config import Config
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
BUCKET_NAME = "diffstore"

def upload_models(account_id, access_key, secret_key):
    endpoint = f"https://{account_id}.r2.cloudflarestorage.com"

    s3 = boto3.client(
        's3',
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(
            signature_version='s3v4',
            s3={'addressing_style': 'path'},
        ),
        region_name='auto',
        verify=False,
    )

    # Listar pares disponíveis
    pairs = [d for d in os.listdir(MODELS_DIR) if os.path.isdir(os.path.join(MODELS_DIR, d))]

    print(f"Pares encontrados: {pairs}")
    print(f"Bucket: {BUCKET_NAME}")
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

            try:
                with open(local_path, 'rb') as f:
                    s3.upload_fileobj(f, BUCKET_NAME, s3_key)
                print("OK")
            except Exception as e:
                print(f"ERRO: {e}")

        print()

    # Gerar URLs
    public_base = f"https://{BUCKET_NAME}.{account_id}.r2.dev"
    print("=" * 60)
    print("URLS DOS MODELOS")
    print("=" * 60)
    for pair in pairs:
        print(f"{public_base}/{pair}/encoder_model_quantized.onnx")
        print(f"{public_base}/{pair}/decoder_model_quantized.onnx")
        print(f"{public_base}/{pair}/tokenizer.json")
        print()

if __name__ == "__main__":
    import sys
    upload_models(
        account_id="69a48d4ddb6b8ec51f460da8856cf2a",
        access_key="9ef70d80b33dc8db04f5b4b17ca9dbbf",
        secret_key="1d56ee49ce674daee32c43fb2dbe33b730f008637ec263011e19c68afd9c4e6",
    )
