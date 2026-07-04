/**
 * Script para gerar dicionários JA, ZH, KO, AR
 * Fase 3: Adicionar japonês, chinês, coreano, árabe
 */

const fs = require('fs');
const path = require('path');

// Vocabulário PT → JA
const VOCABULARY_JA = {
  // Corpo humano
  'corpo': '体', 'cabeça': '頭', 'rosto': '顔', 'olhos': '目',
  'boca': '口', 'nariz': '鼻', 'orelhas': '耳', 'pescoço': '首',
  'ombros': '肩', 'braços': '腕', 'mãos': '手', 'dedos': '指',
  'peito': '胸', 'costas': '背中', 'abdomen': 'お腹', 'quadril': '腰',
  'pernas': '脚', 'joelhos': '膝', 'pés': '足',
  
  // Alimentos
  'arroz': 'ご飯', 'feijão': '豆', 'carne': '肉', 'frango': '鶏肉',
  'peixe': '魚', 'ovo': '卵', 'leite': '牛乳', 'pão': 'パン',
  'queijo': 'チーズ', 'fruta': '果物', 'legume': '野菜', 'salada': 'サラダ',
  'água': '水', 'café': 'コーヒー', 'suco': 'ジュース',
  
  // Exercícios
  'exercício': '運動', 'treino': 'トレーニング', 'musculação': '筋トレ',
  'cardio': '有酸素', 'alongamento': 'ストレッチ', 'aquecimento': 'ウォームアップ',
  'flexão': '腕立て伏せ', 'agachamento': 'スクワット', 'abdominal': '腹筋',
  'prancha': 'プランク', 'corrida': 'ランニング', 'caminhada': 'ウォーキング',
  'natação': '水泳', 'ciclismo': 'サイクリング', 'yoga': 'ヨガ', 'pilates': 'ピラティス',
  
  // Saúde
  'saúde': '健康', 'doença': '病気', 'remédio': '薬', 'vitamina': 'ビタミン',
  'proteína': 'タンパク質', 'carboidrato': '炭水化物', 'gordura': '脂肪', 'caloria': 'カロリー',
  'dieta': 'ダイエット', 'nutrição': '栄養',
  
  // Sentimentos
  'alegria': '喜び', 'tristeza': '悲しみ', 'raiva': '怒り', 'medo': '恐怖',
  'surpresa': '驚き', 'amor': '愛', 'feliz': '嬉しい', 'triste': '悲しい',
  'cansado': '疲れた', 'animado': 'ワクワク',
  
  // Tempo
  'hoje': '今日', 'ontem': '昨日', 'amanhã': '明日', 'agora': '今',
  'depois': '後で', 'antes': '前に', 'sempre': 'いつも', 'nunca': ' never',
  
  // Lugares
  'casa': '家', 'academia': 'ジム', 'escola': '学校', 'trabalho': '仕事',
  'parque': '公園', 'praia': 'ビーチ', 'restaurante': 'レストラン', 'hospital': '病院',
  
  // Cores
  'vermelho': '赤', 'azul': '青', 'verde': '緑', 'amarelo': '黄色',
  'laranja': 'オレンジ', 'roxo': '紫', 'rosa': 'ピンク', 'preto': '黒',
  'branco': '白', 'marrom': '茶色', 'cinza': '灰色',
  
  // Girias japonesas
  'legal': 'すごい', 'bacana': 'かっこいい', 'massa': '最高', 'top': 'トップ',
  'firme': 'しっかり', 'tranquilo': '大丈夫', 'cara': 'やつ', 'maluco': '疯狂',
};

// Vocabulário PT → ZH (Chinês Simplificado)
const VOCABULARY_ZH = {
  // Corpo humano
  'corpo': '身体', 'cabeça': '头', 'rosto': '脸', 'olhos': '眼睛',
  'boca': '嘴', 'nariz': '鼻子', 'orelhas': '耳朵', 'pescoço': '脖子',
  'ombros': '肩膀', 'braços': '手臂', 'mãos': '手', 'dedos': '手指',
  'peito': '胸', 'costas': '背', 'abdomen': '腹部', 'quadril': '臀部',
  'pernas': '腿', 'joelhos': '膝盖', 'pés': '脚',
  
  // Alimentos
  'arroz': '米饭', 'feijão': '豆类', 'carne': '肉', 'frango': '鸡肉',
  'peixe': '鱼', 'ovo': '鸡蛋', 'leite': '牛奶', 'pão': '面包',
  'queijo': '奶酪', 'fruta': '水果', 'legume': '蔬菜', 'salada': '沙拉',
  'água': '水', 'café': '咖啡', 'suco': '果汁',
  
  // Exercícios
  'exercício': '运动', 'treino': '训练', 'musculação': '力量训练',
  'cardio': '有氧', 'alongamento': '拉伸', 'aquecimento': '热身',
  'flexão': '俯卧撑', 'agachamento': '深蹲', 'abdominal': '腹肌',
  'prancha': '平板支撑', 'corrida': '跑步', 'caminhada': '步行',
  'natação': '游泳', 'ciclismo': '骑车', 'yoga': '瑜伽', 'pilates': '普拉提',
  
  // Saúde
  'saúde': '健康', 'doença': '疾病', 'remédio': '药物', 'vitamina': '维生素',
  'proteína': '蛋白质', 'carboidrato': '碳水化合物', 'gordura': '脂肪', 'caloria': '卡路里',
  'dieta': '饮食', 'nutrição': '营养',
  
  // Sentimentos
  'alegria': '快乐', 'tristeza': '悲伤', 'raiva': '愤怒', 'medo': '恐惧',
  'surpresa': '惊喜', 'amor': '爱', 'feliz': '开心', 'triste': '难过',
  'cansado': '累', 'animado': '兴奋',
  
  // Tempo
  'hoje': '今天', 'ontem': '昨天', 'amanhã': '明天', 'agora': '现在',
  'depois': '之后', 'antes': '之前', 'sempre': '总是', 'nunca': '从不',
  
  // Lugares
  'casa': '家', 'academia': '健身房', 'escola': '学校', 'trabalho': '工作',
  'parque': '公园', 'praia': '海滩', 'restaurante': '餐厅', 'hospital': '医院',
  
  // Cores
  'vermelho': '红色', 'azul': '蓝色', 'verde': '绿色', 'amarelo': '黄色',
  'laranja': '橙色', 'roxo': '紫色', 'rosa': '粉色', 'preto': '黑色',
  'branco': '白色', 'marrom': '棕色', 'cinza': '灰色',
};

// Vocabulário PT → KO (Coreano)
const VOCABULARY_KO = {
  // Corpo humano
  'corpo': '몸', 'cabeça': '머리', 'rosto': '얼굴', 'olhos': '눈',
  'boca': '입', 'nariz': '코', 'orelhas': '귀', 'pescoço': '목',
  'ombros': '어깨', 'braços': '팔', 'mãos': '손', 'dedos': '손가락',
  'peito': '가슴', 'costas': '등', 'abdomen': '배', 'quadril': '엉덩이',
  'pernas': '다리', 'joelhos': '무릎', 'pés': '발',
  
  // Alimentos
  'arroz': '밥', 'feijão': '콩', 'carne': '고기', 'frango': '닭고기',
  'peixe': '생선', 'ovo': '달걀', 'leite': '우유', 'pão': '빵',
  'queijo': '치즈', 'fruta': '과일', 'legume': '채소', 'salada': '샐러드',
  'água': '물', 'café': '커피', 'suco': '주스',
  
  // Exercícios
  'exercício': '운동', 'treino': '훈련', 'musculação': '근력 운동',
  'cardio': '유산소', 'alongamento': '스트레칭', 'aquecimento': '워밍업',
  'flexão': '팔굽혀펴기', 'agachamento': '스쿼트', 'abdominal': '복근',
  'prancha': '플랭크', 'corrida': '달리기', 'caminhada': '보행',
  'natação': '수영', 'ciclismo': '자전거', 'yoga': '요가', 'pilates': '필라테스',
  
  // Saúde
  'saúde': '건강', 'doença': '질병', 'remédio': '약', 'vitamina': '비타민',
  'proteína': '단백질', 'carboidrato': '탄수화물', 'gordura': '지방', 'caloria': '칼로리',
  'dieta': '다이어트', 'nutrição': '영양',
  
  // Sentimentos
  'alegria': '기쁨', 'tristeza': '슬픔', 'raiva': '화', 'medo': '두려움',
  'surpresa': '놀람', 'amor': '사랑', 'feliz': '행복한', 'triste': '슬픈',
  'cansado': '피곤한', 'animado': '신나는',
  
  // Tempo
  'hoje': '오늘', 'ontem': '어제', 'amanhã': '내일', 'agora': '지금',
  'depois': '이후', 'antes': '이전', 'sempre': '항상', 'nunca': '절대',
  
  // Lugares
  'casa': '집', 'academia': '헬스장', 'escola': '학교', 'trabalho': '일',
  'parque': '공원', 'praia': '해변', 'restaurante': '식당', 'hospital': '병원',
  
  // Cores
  'vermelho': '빨간색', 'azul': '파란색', 'verde': '초록색', 'amarelo': '노란색',
  'laranja': '주황색', 'roxo': '보라색', 'rosa': '분홍색', 'preto': '검정색',
  'branco': '흰색', 'marrom': '갈색', 'cinza': '회색',
};

// Vocabulário PT → AR (Árabe)
const VOCABULARY_AR = {
  // Corpo humano
  'corpo': 'جسم', 'cabeça': 'رأس', 'rosto': 'وجه', 'olhos': 'عيون',
  'boca': 'فم', 'nariz': 'أنف', 'orelhas': 'آذان', 'pescoço': 'رقبة',
  'ombros': 'كتف', 'braços': 'ذراعين', 'mãos': 'يدان', 'dedos': 'أصابع',
  'peito': 'صدر', 'costas': 'ظهر', 'abdomen': 'بطن', 'quadril': 'ورك',
  'pernas': 'ساقين', 'joelhos': 'ركبتين', 'pés': 'قدمين',
  
  // Alimentos
  'arroz': 'أرز', 'feijão': 'فاصوليا', 'carne': 'لحمة', 'frango': 'دجاج',
  'peixe': 'سمك', 'ovo': 'بيضة', 'leite': 'حليب', 'pão': 'خبز',
  'queiju': 'جبنة', 'fruta': 'فاكهة', 'legume': 'خضار', 'salada': 'سلطة',
  'água': 'ماء', 'café': 'قهوة', 'suco': 'عصير',
  
  // Exercícios
  'exercício': 'تمرين', 'treino': 'تدريب', 'musculação': 'كمال الأجسام',
  'cardio': 'أ-cardيو', 'alongamento': 'تمدد', 'aquecimento': 'إحماء',
  'flexão': 'flexão', 'agachamento': 'قرفصاء', 'abdominal': 'بطن',
  'prancha': 'بلانك', 'corrida': 'جري', 'caminhada': 'مشي',
  'natação': 'سباحة', 'ciclismo': 'دراجة', 'yoga': 'يوغا', 'pilates': 'بيلاتس',
  
  // Saúde
  'saúde': 'صحة', 'doença': 'مرض', 'remédio': 'دواء', 'vitamina': 'فيتامين',
  'proteína': 'بروتين', 'carboidrato': 'كربوهيدرات', 'gordura': 'دهون', 'caloria': 'سعرات',
  'dieta': 'حمية', 'nutrição': 'تغذية',
  
  // Sentimentos
  'alegria': 'فرح', 'tristeza': 'حزن', 'raiva': 'غضب', 'medo': 'خوف',
  'surpresa': 'مفاجأة', 'amor': 'حب', 'feliz': 'سعيد', 'triste': 'حزين',
  'cansado': 'متعب', 'animado': 'متحمس',
  
  // Tempo
  'hoje': 'اليوم', 'ontem': 'أمس', 'amanhã': 'غداً', 'agora': 'الآن',
  'depois': 'بعد', 'antes': 'قبل', 'sempre': 'دائماً', 'nunca': 'أبداً',
  
  // Lugares
  'casa': 'منزل', 'academia': 'صالة رياضية', 'escola': 'مدرسة', 'trabalho': 'عمل',
  'parque': 'حديقة', 'praia': 'شاطئ', 'restaurante': 'مطعم', 'hospital': 'مستشفى',
  
  // Cores
  'vermelho': 'أحمر', 'azul': 'أزرق', 'verde': 'أخضر', 'amarelo': 'أصفر',
  'laranja': 'برتقالي', 'roxo': 'بنفسجي', 'rosa': 'وردي', 'preto': 'أسود',
  'branco': 'أبيض', 'marتم': 'بني', 'cinza': 'رمادي',
};

function generateDictionary(vocab, lang) {
  const dictionary = {};
  for (const [key, value] of Object.entries(vocab)) {
    dictionary[key] = value;
  }
  return dictionary;
}

function saveDictionary(dictionary, lang, entries) {
  const outputPath = path.join(__dirname, '..', 'src', 'dictionaries', `dictionary${lang}.ts`);
  const content = `// dictionary${lang}.ts - Dicionário ${lang.toUpperCase()} com ${entries} entradas
// Gerado automaticamente pelo script generate-ja-zh-ko-ar.js

export const ${lang.toUpperCase()}_DICTIONARY: Record<string, string> = ${JSON.stringify(dictionary, null, 2)};
`;
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Dicionário ${lang.toUpperCase()} salvo: ${outputPath} (${entries} entradas)`);
}

function main() {
  console.log('Gerando dicionários JA, ZH, KO, AR...');
  
  const jaDict = generateDictionary(VOCABULARY_JA, 'ja');
  saveDictionary(jaDict, 'ja', Object.keys(jaDict).length);
  
  const zhDict = generateDictionary(VOCABULARY_ZH, 'zh');
  saveDictionary(zhDict, 'zh', Object.keys(zhDict).length);
  
  const koDict = generateDictionary(VOCABULARY_KO, 'ko');
  saveDictionary(koDict, 'ko', Object.keys(koDict).length);
  
  const arDict = generateDictionary(VOCABULARY_AR, 'ar');
  saveDictionary(arDict, 'ar', Object.keys(arDict).length);
  
  console.log('Geração JA, ZH, KO, AR concluída!');
}

main();
