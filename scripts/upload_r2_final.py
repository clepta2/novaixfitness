"""
Upload para Cloudflare R2 com TLS forçado
"""

import os
import ssl
import hashlib
import hmac
import datetime
import http.client
import json

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
BUCKET_NAME = "diffstore"
ACCOUNT_ID = "69a48d4ddb6b8ec51f460da8856cf2a"
ACCESS_KEY = "9ef70d80b33dc8db04f5b4b17ca9dbbf"
SECRET_KEY = "1d56ee49ce674daee32c43fb2dbe33b730f008637ec263011e19c68afd9c4e6"
HOST = f"{ACCOUNT_ID}.r2.cloudflarestorage.com"

def get_ssl_context():
    ctx = ssl.create_default_context()
    ctx.set_ciphers('DEFAULT@SECLEVEL=1')
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
    except:
        pass
    return ctx

def sign_request(method, path, date, content_type="", body=b""):
    string_to_sign = f"{method}\n\n{content_type}\n{date}\n/{BUCKET_NAME}{path}"
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        string_to_sign.encode('utf-8'),
        hashlib.sha1
    ).hexdigest()
    return f"AWS {ACCESS_KEY}:{signature}"

def upload_file(local_path, s3_key):
    file_size = os.path.getsize(local_path)
    date = datetime.datetime.now(datetime.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')
    path = f"/{s3_key}"

    with open(local_path, 'rb') as f:
        body = f.read()

    headers = {
        'Date': date,
        'Authorization': sign_request('PUT', path, date, 'application/octet-stream', body),
        'Content-Type': 'application/octet-stream',
        'Content-Length': str(file_size),
    }

    ctx = get_ssl_context()
    conn = http.client.HTTPSConnection(HOST, context=ctx, timeout=300)
    conn.request('PUT', f'/{BUCKET_NAME}{path}', body=body, headers=headers)
    response = conn.getresponse()
    conn.close()

    return response.status in [200, 201]

def main():
    pairs = [d for d in os.listdir(MODELS_DIR) if os.path.isdir(os.path.join(MODELS_DIR, d))]

    print(f"Bucket: {BUCKET_NAME}")
    print(f"Host: {HOST}")
    print(f"Pares: {pairs}")
    print()

    # Testar conexão primeiro
    print("Testando conexão...")
    ctx = get_ssl_context()
    try:
        conn = http.client.HTTPSConnection(HOST, context=ctx, timeout=10)
        conn.request('GET', f'/{BUCKET_NAME}/')
        response = conn.getresponse()
        conn.close()
        print(f"Conexão OK (status: {response.status})")
    except Exception as e:
        print(f"ERRO de conexão: {e}")
        return

    print()

    success_count = 0
    fail_count = 0

    for pair in pairs:
        pair_dir = os.path.join(MODELS_DIR, pair)
        files = [f for f in os.listdir(pair_dir) if f.endswith(('.onnx', '.json')) and not f.startswith('.')]

        print(f"Uploading {pair}...")

        for filename in files:
            local_path = os.path.join(pair_dir, filename)
            s3_key = f"{pair}/{filename}"
            file_size = os.path.getsize(local_path) / 1024 / 1024

            print(f"  {filename} ({file_size:.1f}MB)...", end=" ", flush=True)

            try:
                if upload_file(local_path, s3_key):
                    print("OK")
                    success_count += 1
                else:
                    print("FALHOU")
                    fail_count += 1
            except Exception as e:
                print(f"ERRO: {e}")
                fail_count += 1

    print()
    print(f"Resultado: {success_count} OK, {fail_count} falhas")

    public_base = f"https://{BUCKET_NAME}.{ACCOUNT_ID}.r2.dev"
    print()
    print("URLs:")
    for pair in pairs:
        print(f"  {public_base}/{pair}/encoder_model_quantized.onnx")
        print(f"  {public_base}/{pair}/decoder_model_quantized.onnx")
        print(f"  {public_base}/{pair}/tokenizer.json")

if __name__ == "__main__":
    main()
