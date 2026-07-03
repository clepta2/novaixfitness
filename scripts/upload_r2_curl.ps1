# Upload dos modelos para Cloudflare R2 usando curl
# Execute: powershell -ExecutionPolicy Bypass -File scripts/upload_r2_curl.ps1

$R2_ACCOUNT_ID = "69a48d4ddb6b8ec51f460da8856cf2a"
$R2_ACCESS_KEY = "9ef70d80b33dc8db04f5b4b17ca9dbbf"
$R2_SECRET_KEY = "1d56ee49ce674daee32c43fb2dbe33b730f008637ec263011e19c68afd9c4e6"
$R2_ENDPOINT = "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
$BUCKET = "diffstore"
$MODELS_DIR = ".\models"

Write-Host "=========================================="
Write-Host "Upload para Cloudflare R2"
Write-Host "=========================================="
Write-Host ""

# Testar conexão
Write-Host "Testando conexão..."
$testResult = & "C:\Windows\System32\curl.exe" -s -o $null -w "%{http_code}" --ssl-no-revoke "$R2_ENDPOINT/$BUCKET/"
Write-Host "Status: $testResult"

if ($testResult -eq "000") {
    Write-Host "ERRO: Não foi possível conectar ao R2"
    exit 1
}

Write-Host ""

# Upload de cada par
$pairs = @("pt-en", "en-pt")

foreach ($pair in $pairs) {
    $pairDir = "$MODELS_DIR\$pair"
    if (-not (Test-Path $pairDir)) {
        Write-Host "Pasta não encontrada: $pairDir"
        continue
    }

    Write-Host "Uploading $pair..."
    $files = Get-ChildItem "$pairDir\*.onnx", "$pairDir\*.json" -ErrorAction SilentlyContinue

    foreach ($file in $files) {
        $filename = $file.Name
        $s3Key = "$pair/$filename"
        $fileSize = [math]::Round($file.Length / 1MB, 1)

        Write-Host "  $filename ($fileSize MB)..." -NoNewline

        $result = & "C:\Windows\System32\curl.exe" -s -o $null -w "%{http_code}" `
            --ssl-no-revoke `
            -X PUT `
            -H "Content-Type: application/octet-stream" `
            --data-binary "@$($file.FullName)" `
            "$R2_ENDPOINT/$BUCKET/$s3Key" `
            -u "${R2_ACCESS_KEY}:${R2_SECRET_KEY}"

        if ($result -eq "200" -or $result -eq "201") {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Write-Host " FALHOU ($result)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "=========================================="
Write-Host "Upload concluído!"
Write-Host ""
Write-Host "URLs dos modelos:"
$publicBase = "https://$BUCKET.$R2_ACCOUNT_ID.r2.dev"
foreach ($pair in $pairs) {
    Write-Host "  $publicBase/$pair/encoder_model_quantized.onnx"
    Write-Host "  $publicBase/$pair/decoder_model_quantized.onnx"
    Write-Host "  $publicBase/$pair/tokenizer.json"
}
Write-Host "=========================================="
