import os
import torch
from transformers import MarianMTModel, MarianTokenizer
from onnxruntime.quantization import quantize_dynamic, QuantType

MODEL_ID = 'Helsinki-NLP/opus-mt-ja-pt'
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'ja-pt')

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f'Carregando modelo {MODEL_ID}...')
tokenizer = MarianTokenizer.from_pretrained(MODEL_ID)
model = MarianMTModel.from_pretrained(MODEL_ID)
model.eval()

print('Exportando encoder para ONNX...')
encoder = model.get_encoder()
dummy_ids = torch.zeros((1, 10), dtype=torch.long)
dummy_mask = torch.ones((1, 10), dtype=torch.long)

enc_path = os.path.join(OUTPUT_DIR, 'encoder_model.onnx')
torch.onnx.export(
    encoder,
    (dummy_ids, dummy_mask),
    enc_path,
    input_names=['input_ids', 'attention_mask'],
    output_names=['last_hidden_state'],
    dynamic_axes={
        'input_ids': {0: 'batch', 1: 'seq'},
        'attention_mask': {0: 'batch', 1: 'seq'},
        'last_hidden_state': {0: 'batch', 1: 'seq'},
    },
    opset_version=14,
)
print(f'  Encoder: {os.path.getsize(enc_path) / 1024 / 1024:.1f}MB')

print('Exportando decoder para ONNX...')
decoder = model.get_decoder()
decoder.eval()
dec_ids = torch.zeros((1, 1), dtype=torch.long)
enc_hidden = torch.randn((1, 10, model.config.d_model))
dec_mask = torch.ones((1, 10), dtype=torch.long)

dec_path = os.path.join(OUTPUT_DIR, 'decoder_model.onnx')
torch.onnx.export(
    decoder,
    (dec_ids, enc_hidden, dec_mask),
    dec_path,
    input_names=['input_ids', 'encoder_hidden_states', 'attention_mask'],
    output_names=['last_hidden_state'],
    dynamic_axes={
        'input_ids': {0: 'batch', 1: 'dec_seq'},
        'encoder_hidden_states': {0: 'batch', 1: 'enc_seq'},
        'attention_mask': {0: 'batch', 1: 'enc_seq'},
        'last_hidden_state': {0: 'batch', 1: 'dec_seq'},
    },
    opset_version=14,
)
print(f'  Decoder: {os.path.getsize(dec_path) / 1024 / 1024:.1f}MB')

print('Salvando tokenizer...')
tokenizer.save_pretrained(OUTPUT_DIR)

print('Convertendo para INT8...')
for f in ['encoder_model.onnx', 'decoder_model.onnx']:
    inp = os.path.join(OUTPUT_DIR, f)
    out = os.path.join(OUTPUT_DIR, f.replace('.onnx', '_quantized.onnx'))
    quantize_dynamic(inp, out, weight_type=QuantType.QInt8)
    size = os.path.getsize(out) / 1024 / 1024
    name = f.replace('.onnx', '_quantized.onnx')
    print(f'  {name}: {size:.1f}MB')

print('Limpando ONNX bruto...')
for f in ['encoder_model.onnx', 'decoder_model.onnx']:
    p = os.path.join(OUTPUT_DIR, f)
    if os.path.exists(p):
        os.remove(p)

print('✅ Conversão JA→PT concluída!')
