/**
 * Script para regenerar TODOS os dicionários com estrutura correta
 * Todos devem ter: Record<string, { pt: string; en: string; es: string; fr: string; de: string; it: string; ja: string; zh: string; ko: string; ar: string }>
 */

const fs = require('fs');
const path = require('path');

// Vocabulário completo com traduções para TODOS os idiomas
const VOCABULARY = {
  // Corpo humano
  'corpo': { en: 'body', es: 'cuerpo', fr: 'corps', de: 'Körper', it: 'corpo', ja: '体', zh: '身体', ko: '몸', ar: 'جسم' },
  'cabeça': { en: 'head', es: 'cabeza', fr: 'tête', de: 'Kopf', it: 'testa', ja: '頭', zh: '头', ko: '머리', ar: 'رأس' },
  'rosto': { en: 'face', es: 'cara', fr: 'visage', de: 'Gesicht', it: 'viso', ja: '顔', zh: '脸', ko: '얼굴', ar: 'وجه' },
  'olhos': { en: 'eyes', es: 'ojos', fr: 'yeux', de: 'Augen', it: 'occhi', ja: '目', zh: '眼睛', ko: '눈', ar: 'عيون' },
  'boca': { en: 'mouth', es: 'boca', fr: 'bouche', de: 'Mund', it: 'bocca', ja: '口', zh: '嘴', ko: '입', ar: 'فم' },
  'nariz': { en: 'nose', es: 'nariz', fr: 'nez', de: 'Nase', it: 'naso', ja: '鼻', zh: '鼻子', ko: '코', ar: 'أنف' },
  'orelhas': { en: 'ears', es: 'orejas', fr: 'oreilles', de: 'Ohren', it: 'orecchie', ja: '耳', zh: '耳朵', ko: '귀', ar: 'آذان' },
  'pescoço': { en: 'neck', es: 'cuello', fr: 'cou', de: 'Nacken', it: 'collo', ja: '首', zh: '脖子', ko: '목', ar: 'رقبة' },
  'ombros': { en: 'shoulders', es: 'hombros', fr: 'épaules', de: 'Schultern', it: 'spalle', ja: '肩', zh: '肩膀', ko: '어깨', ar: 'كتف' },
  'braços': { en: 'arms', es: 'brazos', fr: 'bras', de: 'Arme', it: 'braccia', ja: '腕', zh: '手臂', ko: '팔', ar: 'ذراعين' },
  'mãos': { en: 'hands', es: 'manos', fr: 'mains', de: 'Hände', it: 'mani', ja: '手', zh: '手', ko: '손', ar: 'يدان' },
  'dedos': { en: 'fingers', es: 'dedos', fr: 'doigts', de: 'Finger', it: 'dita', ja: '指', zh: '手指', ko: '손가락', ar: 'أصابع' },
  'peito': { en: 'chest', es: 'pecho', fr: 'poitrine', de: 'Brust', it: 'petto', ja: '胸', zh: '胸', ko: '가슴', ar: 'صدر' },
  'costas': { en: 'back', es: 'espalda', fr: 'dos', de: 'Rücken', it: 'schiena', ja: '背中', zh: '背', ko: '등', ar: 'ظهر' },
  'abdomen': { en: 'abdomen', es: 'abdomen', fr: 'abdomen', de: 'Bauch', it: 'addome', ja: 'お腹', zh: '腹部', ko: '배', ar: 'بطن' },
  'quadril': { en: 'hips', es: 'caderas', fr: 'hanches', de: 'Hüfte', it: 'fianchi', ja: '腰', zh: '臀部', ko: '엉덩이', ar: 'ورك' },
  'pernas': { en: 'legs', es: 'piernas', fr: 'jambes', de: 'Beine', it: 'gambe', ja: '脚', zh: '腿', ko: '다리', ar: 'ساقين' },
  'joelhos': { en: 'knees', es: 'rodillas', fr: 'genoux', de: 'Knie', it: 'ginocchia', ja: '膝', zh: '膝盖', ko: '무릎', ar: 'ركبتين' },
  'pés': { en: 'feet', es: 'pies', fr: 'pieds', de: 'Füße', it: 'piedi', ja: '足', zh: '脚', ko: '발', ar: 'قدمين' },
  
  // Alimentos
  'arroz': { en: 'rice', es: 'arroz', fr: 'riz', de: 'Reis', it: 'riso', ja: 'ご飯', zh: '米饭', ko: '밥', ar: 'أرز' },
  'feijão': { en: 'beans', es: 'frijoles', fr: 'haricots', de: 'Bohnen', it: 'fagioli', ja: '豆', zh: '豆类', ko: '콩', ar: 'فاصوليا' },
  'carne': { en: 'meat', es: 'carne', fr: 'viande', de: 'Fleisch', it: 'carne', ja: '肉', zh: '肉', ko: '고기', ar: 'لحمة' },
  'frango': { en: 'chicken', es: 'pollo', fr: 'poulet', de: 'Hähnchen', it: 'pollo', ja: '鶏肉', zh: '鸡肉', ko: '닭고기', ar: 'دجاج' },
  'peixe': { en: 'fish', es: 'pescado', fr: 'poisson', de: 'Fisch', it: 'pesce', ja: '魚', zh: '鱼', ko: '생선', ar: 'سمك' },
  'ovo': { en: 'egg', es: 'huevo', fr: 'œuf', de: 'Ei', it: 'uovo', ja: '卵', zh: '鸡蛋', ko: '달걀', ar: 'بيضة' },
  'leite': { en: 'milk', es: 'leche', fr: 'lait', de: 'Milch', it: 'latte', ja: '牛乳', zh: '牛奶', ko: '우유', ar: 'حليب' },
  'pão': { en: 'bread', es: 'pan', fr: 'pain', de: 'Brot', it: 'pane', ja: 'パン', zh: '面包', ko: '빵', ar: 'خبز' },
  'queijo': { en: 'cheese', es: 'queso', fr: 'fromage', de: 'Käse', it: 'formaggio', ja: 'チーズ', zh: '奶酪', ko: '치즈', ar: 'جبنة' },
  'fruta': { en: 'fruit', es: 'fruta', fr: 'fruit', de: 'Obst', it: 'frutta', ja: '果物', zh: '水果', ko: '과일', ar: 'فاكهة' },
  'legume': { en: 'vegetable', es: 'verdura', fr: 'légume', de: 'Gemüse', it: 'verdura', ja: '野菜', zh: '蔬菜', ko: '채소', ar: 'خضار' },
  'salada': { en: 'salad', es: 'ensalada', fr: 'salade', de: 'Salat', it: 'insalata', ja: 'サラダ', zh: '沙拉', ko: '샐러드', ar: 'سلطة' },
  'água': { en: 'water', es: 'agua', fr: 'eau', de: 'Wasser', it: 'acqua', ja: '水', zh: '水', ko: '물', ar: 'ماء' },
  'café': { en: 'coffee', es: 'café', fr: 'café', de: 'Kaffee', it: 'caffè', ja: 'コーヒー', zh: '咖啡', ko: '커피', ar: 'قهوة' },
  'suco': { en: 'juice', es: 'jugo', fr: 'jus', de: 'Saft', it: 'succo', ja: 'ジュース', zh: '果汁', ko: '주스', ar: 'عصير' },
  
  // Exercícios
  'exercício': { en: 'exercise', es: 'ejercicio', fr: 'exercice', de: 'Übung', it: 'esercizio', ja: '運動', zh: '运动', ko: '운동', ar: 'تمرين' },
  'treino': { en: 'workout', es: 'entrenamiento', fr: 'entraînement', de: 'Training', it: 'allenamento', ja: 'トレーニング', zh: '训练', ko: '훈련', ar: 'تدريب' },
  'musculação': { en: 'weight training', es: 'musculación', fr: 'musculation', de: 'Krafttraining', it: 'palestrismo', ja: '筋トレ', zh: '力量训练', ko: '근력 운동', ar: 'كمال الأجسام' },
  'cardio': { en: 'cardio', es: 'cardio', fr: 'cardio', de: 'Cardio', it: 'cardio', ja: '有酸素', zh: '有氧', ko: '유산소', ar: '_cardio' },
  'alongamento': { en: 'stretching', es: 'estiramiento', fr: 'étirement', de: 'Dehnung', it: 'stretching', ja: 'ストレッチ', zh: '拉伸', ko: '스트레칭', ar: 'تمدد' },
  'aquecimento': { en: 'warm-up', es: 'calentamiento', fr: 'échauffement', de: 'Aufwärmen', it: 'riscaldamento', ja: 'ウォームアップ', zh: '热身', ko: '워밍업', ar: 'إحماء' },
  'flexão': { en: 'push-up', es: 'flexión de brazos', fr: 'pompe', de: 'Liegestütz', it: 'push-up', ja: '腕立て伏せ', zh: '俯卧撑', ko: '팔굽혀펴기', ar: 'flexão' },
  'agachamento': { en: 'squat', es: 'sentadilla', fr: 'squat', de: 'Kniebeuge', it: 'squat', ja: 'スクワット', zh: '深蹲', ko: '스쿼트', ar: 'قرفصاء' },
  'abdominal': { en: 'crunch', es: 'abdominal', fr: 'crunch', de: 'Bauchpresse', it: 'addominali', ja: '腹筋', zh: '腹肌', ko: '복근', ar: 'بطن' },
  'prancha': { en: 'plank', es: 'plancha', fr: 'planche', de: 'Plank', it: 'plank', ja: 'プランク', zh: '平板支撑', ko: '플랭크', ar: 'بلانك' },
  'corrida': { en: 'running', es: 'correr', fr: 'course', de: 'Laufen', it: 'corsa', ja: 'ランニング', zh: '跑步', ko: '달리기', ar: 'جري' },
  'caminhada': { en: 'walking', es: 'caminar', fr: 'marche', de: 'Spaziergang', it: 'camminata', ja: 'ウォーキング', zh: '步行', ko: '보행', ar: 'مشي' },
  'natação': { en: 'swimming', es: 'natación', fr: 'natation', de: 'Schwimmen', it: 'nuoto', ja: '水泳', zh: '游泳', ko: '수영', ar: 'سباحة' },
  'ciclismo': { en: 'cycling', es: 'ciclismo', fr: 'cyclisme', de: 'Radfahren', it: 'ciclismo', ja: 'サイクリング', zh: '骑车', ko: '자전거', ar: 'دراجة' },
  'yoga': { en: 'yoga', es: 'yoga', fr: 'yoga', de: 'Yoga', it: 'yoga', ja: 'ヨガ', zh: '瑜伽', ko: '요가', ar: 'يوغا' },
  'pilates': { en: 'pilates', es: 'pilates', fr: 'pilates', de: 'Pilates', it: 'pilates', ja: 'ピラティス', zh: '普拉提', ko: '필라테스', ar: 'بيلاتس' },
  
  // Saúde
  'saúde': { en: 'health', es: 'salud', fr: 'santé', de: 'Gesundheit', it: 'salute', ja: '健康', zh: '健康', ko: '건강', ar: 'صحة' },
  'doença': { en: 'disease', es: 'enfermedad', fr: 'maladie', de: 'Krankheit', it: 'malattia', ja: '病気', zh: '疾病', ko: '질병', ar: 'مرض' },
  'remédio': { en: 'medicine', es: 'medicamento', fr: 'médicament', de: 'Medikament', it: 'farmaco', ja: '薬', zh: '药物', ko: '약', ar: 'دواء' },
  'vitamina': { en: 'vitamin', es: 'vitamina', fr: 'vitamine', de: 'Vitamin', it: 'vitamina', ja: 'ビタミン', zh: '维生素', ko: '비타민', ar: 'فيتامين' },
  'proteína': { en: 'protein', es: 'proteína', fr: 'protéine', de: 'Protein', it: 'proteina', ja: 'タンパク質', zh: '蛋白质', ko: '단백질', ar: 'بروتين' },
  'carboidrato': { en: 'carbohydrate', es: 'carbohidrato', fr: 'glucide', de: 'Kohlenhydrat', it: 'carboidrati', ja: '炭水化物', zh: '碳水化合物', ko: '탄수화물', ar: 'كربوهيدرات' },
  'gordura': { en: 'fat', es: 'grasa', fr: 'graisse', de: 'Fett', it: 'grasso', ja: '脂肪', zh: '脂肪', ko: '지방', ar: 'دهون' },
  'caloria': { en: 'calorie', es: 'caloría', fr: 'calorie', de: 'Kalorie', it: 'caloria', ja: 'カロリー', zh: '卡路里', ko: '칼로리', ar: 'سعرات' },
  'dieta': { en: 'diet', es: 'dieta', fr: 'régime', de: 'Diät', it: 'dieta', ja: 'ダイエット', zh: '饮食', ko: '다이어트', ar: 'حمية' },
  'nutrição': { en: 'nutrition', es: 'nutrición', fr: 'nutrition', de: 'Ernährung', it: 'nutrizione', ja: '栄養', zh: '营养', ko: '영양', ar: 'تغذية' },
  
  // Sentimentos
  'alegria': { en: 'joy', es: 'alegría', fr: 'joie', de: 'Freude', it: 'gioia', ja: '喜び', zh: '快乐', ko: '기쁨', ar: 'فرح' },
  'tristeza': { en: 'sadness', es: 'tristeza', fr: 'tristesse', de: 'Traurigkeit', it: 'tristezza', ja: '悲しみ', zh: '悲伤', ko: '슬픔', ar: 'حزن' },
  'raiva': { en: 'anger', es: 'ira', fr: 'colère', de: 'Wut', it: 'rabbia', ja: '怒り', zh: '愤怒', ko: '화', ar: 'غضب' },
  'medo': { en: 'fear', es: 'miedo', fr: 'peur', de: 'Angst', it: 'paura', ja: '恐怖', zh: '恐惧', ko: '두려움', ar: 'خوف' },
  'surpresa': { en: 'surprise', es: 'sorpresa', fr: 'surprise', de: 'Überraschung', it: 'sorpresa', ja: '驚き', zh: '惊喜', ko: '놀람', ar: 'مفاجأة' },
  'amor': { en: 'love', es: 'amor', fr: 'amour', de: 'Liebe', it: 'amore', ja: '愛', zh: '爱', ko: '사랑', ar: 'حب' },
  'feliz': { en: 'happy', es: 'feliz', fr: 'heureux', de: 'glücklich', it: 'felice', ja: '嬉しい', zh: '开心', ko: '행복한', ar: 'سعيد' },
  'triste': { en: 'sad', es: 'triste', fr: 'triste', de: 'traurig', it: 'triste', ja: '悲しい', zh: '难过', ko: '슬픈', ar: 'حزين' },
  'cansado': { en: 'tired', es: 'cansado', fr: 'fatigué', de: 'müde', it: 'stanco', ja: '疲れた', zh: '累', ko: '피곤한', ar: 'متعب' },
  'animado': { en: 'excited', es: 'animado', fr: 'excité', de: 'aufgeregt', it: 'emozionato', ja: 'ワクワク', zh: '兴奋', ko: '신나는', ar: 'متحمس' },
  
  // Tempo
  'hoje': { en: 'today', es: 'hoy', fr: "aujourd'hui", de: 'heute', it: 'oggi', ja: '今日', zh: '今天', ko: '오늘', ar: 'اليوم' },
  'ontem': { en: 'yesterday', es: 'ayer', fr: 'hier', de: 'gestern', it: 'ieri', ja: '昨日', zh: '昨天', ko: '어제', ar: 'أمس' },
  'amanhã': { en: 'tomorrow', es: 'mañana', fr: 'demain', de: 'morgen', it: 'domani', ja: '明日', zh: '明天', ko: '내일', ar: 'غداً' },
  'agora': { en: 'now', es: 'ahora', fr: 'maintenant', de: 'jetzt', it: 'adesso', ja: '今', zh: '现在', ko: '지금', ar: 'الآن' },
  'depois': { en: 'after', es: 'después', fr: 'après', de: 'nachher', it: 'dopo', ja: '後で', zh: '之后', ko: '이후', ar: 'بعد' },
  'antes': { en: 'before', es: 'antes', fr: 'avant', de: 'vorher', it: 'prima', ja: '前に', zh: '之前', ko: '이전', ar: 'قبل' },
  'sempre': { en: 'always', es: 'siempre', fr: 'toujours', de: 'immer', it: 'sempre', ja: 'いつも', zh: '总是', ko: '항상', ar: 'دائماً' },
  'nunca': { en: 'never', es: 'nunca', fr: 'jamais', de: 'nie', it: 'mai', ja: 'never', zh: '从不', ko: '절대', ar: 'أبداً' },
  
  // Lugares
  'casa': { en: 'house', es: 'casa', fr: 'maison', de: 'Haus', it: 'casa', ja: '家', zh: '家', ko: '집', ar: 'منزل' },
  'academia': { en: 'gym', es: 'gimnasio', fr: 'salle de sport', de: 'Fitnessstudio', it: 'palestra', ja: 'ジム', zh: '健身房', ko: '헬스장', ar: 'صالة رياضية' },
  'escola': { en: 'school', es: 'escuela', fr: 'école', de: 'Schule', it: 'scuola', ja: '学校', zh: '学校', ko: '학교', ar: 'مدرسة' },
  'trabalho': { en: 'work', es: 'trabajo', fr: 'travail', de: 'Arbeit', it: 'lavoro', ja: '仕事', zh: '工作', ko: '일', ar: 'عمل' },
  'parque': { en: 'park', es: 'parque', fr: 'parc', de: 'Park', it: 'parco', ja: '公園', zh: '公园', ko: '공원', ar: 'حديقة' },
  'praia': { en: 'beach', es: 'playa', fr: 'plage', de: 'Strand', it: 'spiaggia', ja: 'ビーチ', zh: '海滩', ko: '해변', ar: 'شاطئ' },
  'restaurante': { en: 'restaurant', es: 'restaurante', fr: 'restaurant', de: 'Restaurant', it: 'ristorante', ja: 'レストラン', zh: '餐厅', ko: '식당', ar: 'مطعم' },
  'hospital': { en: 'hospital', es: 'hospital', fr: 'hôpital', de: 'Krankenhaus', it: 'ospedale', ja: '病院', zh: '医院', ko: '병원', ar: 'مستشفى' },
  
  // Cores
  'vermelho': { en: 'red', es: 'rojo', fr: 'rouge', de: 'rot', it: 'rosso', ja: '赤', zh: '红色', ko: '빨간색', ar: 'أحمر' },
  'azul': { en: 'blue', es: 'azul', fr: 'bleu', de: 'blau', it: 'blu', ja: '青', zh: '蓝色', ko: '파란색', ar: 'أزرق' },
  'verde': { en: 'green', es: 'verde', fr: 'vert', de: 'grün', it: 'verde', ja: '緑', zh: '绿色', ko: '초록색', ar: 'أخضر' },
  'amarelo': { en: 'yellow', es: 'amarillo', fr: 'jaune', de: 'gelb', it: 'giallo', ja: '黄色', zh: '黄色', ko: '노란색', ar: 'أصفر' },
  'laranja': { en: 'orange', es: 'naranja', fr: 'orange', de: 'orange', it: 'arancione', ja: 'オレンジ', zh: '橙色', ko: '주황색', ar: 'برتقالي' },
  'roxo': { en: 'purple', es: 'morado', fr: 'violet', de: 'lila', it: 'viola', ja: '紫', zh: '紫色', ko: '보라색', ar: 'بنفسجي' },
  'rosa': { en: 'pink', es: 'rosa', fr: 'rose', de: 'rosa', it: 'rosa', ja: 'ピンク', zh: '粉色', ko: '분홍색', ar: 'وردي' },
  'preto': { en: 'black', es: 'negro', fr: 'noir', de: 'schwarz', it: 'nero', ja: '黒', zh: '黑色', ko: '검정색', ar: 'أسود' },
  'branco': { en: 'white', es: 'blanco', fr: 'blanc', de: 'weiß', it: 'bianco', ja: '白', zh: '白色', ko: '흰색', ar: 'أبيض' },
  'marrom': { en: 'brown', es: 'marrón', fr: 'marron', de: 'braun', it: 'marrone', ja: '茶色', zh: '棕色', ko: '갈색', ar: 'بني' },
  'cinza': { en: 'gray', es: 'gris', fr: 'gris', de: 'grau', it: 'grigio', ja: '灰色', zh: '灰色', ko: '회색', ar: 'رمادي' },
};

// Mapeamento de chaves do PT para cada idioma
const LANG_MAP = {
  pt: (v) => v, // PT retorna o objeto inteiro
  en: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].en === v.en) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  es: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].es === v.es) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  fr: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].fr === v.fr) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  de: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].de === v.de) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  it: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].it === v.it) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  ja: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].ja === v.ja) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  zh: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].zh === v.zh) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  ko: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].ko === v.ko) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
  ar: (v) => ({ pt: Object.keys(VOCABULARY).find(k => VOCABULARY[k].ar === v.ar) || '', en: v.en, es: v.es, fr: v.fr, de: v.de, it: v.it, ja: v.ja, zh: v.zh, ko: v.ko, ar: v.ar }),
};

function generateAllDictionaries() {
  const dictionaries = {};
  
  // Gerar dicionário PT (chave = PT, valor = traduções)
  dictionaries.pt = {};
  for (const [key, value] of Object.entries(VOCABULARY)) {
    dictionaries.pt[key] = value;
  }
  
  // Para cada outro idioma, criar dicionário invertido
  for (const lang of ['en', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ko', 'ar']) {
    dictionaries[lang] = {};
    for (const [ptKey, translations] of Object.entries(VOCABULARY)) {
      const langValue = translations[lang];
      if (langValue) {
        dictionaries[lang][langValue] = {
          pt: ptKey,
          en: translations.en,
          es: translations.es,
          fr: translations.fr,
          de: translations.de,
          it: translations.it,
          ja: translations.ja,
          zh: translations.zh,
          ko: translations.ko,
          ar: translations.ar,
        };
      }
    }
  }
  
  return dictionaries;
}

function saveDictionary(dictionary, lang) {
  const outputPath = path.join(__dirname, '..', 'src', 'dictionaries', `dictionary${lang}.ts`);
  const entries = Object.keys(dictionary).length;
  
  // Para PT, a estrutura é diferente
  let content;
  if (lang === 'pt') {
    content = `// dictionary${lang}.ts - Dicionário ${lang.toUpperCase()} com ${entries} entradas
// Gerado automaticamente pelo script regenerate-all-dictionaries.js

export const ${lang.toUpperCase()}_DICTIONARY: Record<string, { en: string; es: string; fr: string; de: string; it: string; ja: string; zh: string; ko: string; ar: string }> = ${JSON.stringify(dictionary, null, 2)};
`;
  } else {
    content = `// dictionary${lang}.ts - Dicionário ${lang.toUpperCase()} com ${entries} entradas
// Gerado automaticamente pelo script regenerate-all-dictionaries.js

export const ${lang.toUpperCase()}_DICTIONARY: Record<string, { pt: string; en: string; es: string; fr: string; de: string; it: string; ja: string; zh: string; ko: string; ar: string }> = ${JSON.stringify(dictionary, null, 2)};
`;
  }
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Dicionário ${lang.toUpperCase()} salvo: ${outputPath} (${entries} entradas)`);
}

function main() {
  console.log('Regenerando TODOS os dicionários com estrutura correta...');
  
  const dictionaries = generateAllDictionaries();
  
  // Salvar cada dicionário
  for (const [lang, dict] of Object.entries(dictionaries)) {
    saveDictionary(dict, lang);
  }
  
  console.log('\nResumo:');
  for (const [lang, dict] of Object.entries(dictionaries)) {
    console.log(`  ${lang.toUpperCase()}: ${Object.keys(dict).length} entradas`);
  }
  
  console.log('\nRegeneração concluída!');
}

main();
