const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ACCOUNT_ID = '69a48d4ddb6b8ec51f460da8856cf2a';
const ACCESS_KEY = '9ef70d80b33dc8db04f5b4b17ca9dbbf';
const SECRET_KEY = '1d56ee49ce674daee32c43fb2dbe33b730f008637ec263011e19c68afd9c4e6';
const BUCKET = 'diffstore';
const MODELS_DIR = path.join(__dirname, '..', 'models');

// URL do bucket via subdomínio
const R2_ENDPOINT = `https://${BUCKET}.${ACCOUNT_ID}.r2.cloudflarestorage.com`;

function uploadFile(filePath, objectKey) {
  const url = `${R2_ENDPOINT}/${objectKey}`;
  const fileSize = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);

  console.log(`  ${path.basename(filePath)} (${fileSize}MB)...`, { timeout: 300000 });

  try {
    // Usar curl do Windows com autenticação S3 simplificada
    const comando = `curl.exe -s -o nul -w "%{http_code}" --ssl-no-revoke -X PUT -T "${filePath}" -u "${ACCESS_KEY}:${SECRET_KEY}" "${url}"`;
    const resultado = execSync(comando, { encoding: 'utf-8', timeout: 300000 });
    const status = resultado.trim();

    if (status === '200' || status === '201') {
      console.log(`    OK`);
      return true;
    } else {
      console.log(`    FALHOU (status: ${status})`);
      return false;
    }
  } catch (e) {
    console.log(`    ERRO: ${e.message}`);
    return false;
  }
}

// Main
const pairs = fs.readdirSync(MODELS_DIR).filter(d => fs.statSync(path.join(MODELS_DIR, d)).isDirectory());

console.log('==========================================');
console.log('Upload para Cloudflare R2');
console.log('==========================================');
console.log(`Bucket: ${BUCKET}`);
console.log(`Endpoint: ${R2_ENDPOINT}`);
console.log(`Pares: ${pairs}`);
console.log('');

let success = 0;
let fail = 0;

for (const pair of pairs) {
  const pairDir = path.join(MODELS_DIR, pair);
  const files = fs.readdirSync(pairDir).filter(f => f.endsWith('.onnx') || f.endsWith('.json'));

  console.log(`Uploading ${pair}...`);

  for (const file of files) {
    const localPath = path.join(pairDir, file);
    const s3Key = `${pair}/${file}`;

    if (uploadFile(localPath, s3Key)) {
      success++;
    } else {
      fail++;
    }
  }
  console.log('');
}

console.log('==========================================');
console.log(`Resultado: ${success} OK, ${fail} falhas`);
console.log('');
console.log('URLs dos modelos:');
for (const pair of pairs) {
  console.log(`  ${R2_ENDPOINT}/${pair}/encoder_model_quantized.onnx`);
  console.log(`  ${R2_ENDPOINT}/${pair}/decoder_model_quantized.onnx`);
  console.log(`  ${R2_ENDPOINT}/${pair}/tokenizer.json`);
}
console.log('==========================================');
