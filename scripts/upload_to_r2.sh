#!/bin/bash
# Upload dos modelos para Cloudflare R2
# R2 é compatível com AWS S3 API

# Configuração (preencher com suas credenciais)
R2_ACCOUNT_ID="SEU_ACCOUNT_ID"
R2_ACCESS_KEY_ID="SUA_ACCESS_KEY"
R2_SECRET_ACCESS_KEY="SUA_SECRET_KEY"
R2_BUCKET_NAME="novaix-models"
R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

# Modelo local
MODELS_DIR="./models"

echo "==========================================="
echo "Upload para Cloudflare R2"
echo "==========================================="

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "AWS CLI não encontrado. Instalando..."
    pip install awscli
fi

# Configurar endpoint R2
export AWS_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=auto

# Upload de cada par de idioma
for pair in pt-en en-pt; do
    echo ""
    echo "Uploading $pair..."
    
    aws s3 sync \
        "$MODELS_DIR/$pair" \
        "s3://$R2_BUCKET_NAME/$pair/" \
        --endpoint-url $R2_ENDPOINT \
        --exclude "*.cache/*" \
        --exclude ".cache/*"
    
    echo "✓ $pair uploaded"
done

# Torner os arquivos públicos (opcional)
echo ""
echo "Configurando acesso público..."
for pair in pt-en en-pt; do
    for file in encoder_model_quantized.onnx decoder_model_quantized.onnx tokenizer.json config.json; do
        aws s3api put-object-acl \
            --bucket $R2_BUCKET_NAME \
            --key "$pair/$file" \
            --acl public-read \
            --endpoint-url $R2_ENDPOINT 2>/dev/null
    done
done

echo ""
echo "==========================================="
echo "Upload concluído!"
echo ""
echo "URLs dos modelos:"
echo "PT→EN encoder: https://$R2_BUCKET_NAME.${R2_ACCOUNT_ID}.r2.dev/pt-en/encoder_model_quantized.onnx"
echo "PT→EN decoder: https://$R2_BUCKET_NAME.${R2_ACCOUNT_ID}.r2.dev/pt-en/decoder_model_quantized.onnx"
echo "PT→EN tokenizer: https://$R2_BUCKET_NAME.${R2_ACCOUNT_ID}.r2.dev/pt-en/tokenizer.json"
echo "==========================================="
