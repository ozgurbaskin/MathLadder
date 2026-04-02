// Each step has: question: { tr, en, es, de, fr, ar, ru }, same for hint
// title is also translated per level
// Levels are grouped into categories

const allLevels = [
  {
    id: 1,
    category: 'math',
    title: { tr: 'Basamak Basamak', en: 'Step by Step', es: 'Paso a Paso', de: 'Schritt für Schritt', fr: 'Pas à Pas', ar: 'خطوة بخطوة', ru: 'Шаг за Шагом' },
    icon: '🔢',
    difficulty: 1,
    digits: 4,
    color: '#4ade80',
    steps: [
      {
        question: { tr: '10 × 10 × 10 = ?', en: '10 × 10 × 10 = ?', es: '10 × 10 × 10 = ?', de: '10 × 10 × 10 = ?', fr: '10 × 10 × 10 = ?', ar: '10 × 10 × 10 = ?', ru: '10 × 10 × 10 = ?' },
        answer: 1000,
        hint: { tr: "On'un üçüncü kuvveti", en: 'Ten to the power of 3', es: 'Diez al cubo', de: 'Zehn hoch drei', fr: 'Dix au cube', ar: 'عشرة أس ثلاثة', ru: 'Десять в кубе' },
      },
      {
        question: { tr: '9 × 1000 = ?', en: '9 × 1000 = ?', es: '9 × 1000 = ?', de: '9 × 1000 = ?', fr: '9 × 1000 = ?', ar: '9 × 1000 = ?', ru: '9 × 1000 = ?' },
        answer: 9000,
        hint: { tr: 'Dokuz bin', en: 'Nine thousand', es: 'Nueve mil', de: 'Neuntausend', fr: 'Neuf mille', ar: 'تسعة آلاف', ru: 'Девять тысяч' },
      },
      {
        question: { tr: '9000 + 900 = ?', en: '9000 + 900 = ?', es: '9000 + 900 = ?', de: '9000 + 900 = ?', fr: '9000 + 900 = ?', ar: '9000 + 900 = ?', ru: '9000 + 900 = ?' },
        answer: 9900,
        hint: { tr: 'Dokuz bin dokuz yüz', en: 'Nine thousand nine hundred', es: 'Nueve mil novecientos', de: 'Neuntausendneunhundert', fr: 'Neuf mille neuf cents', ar: 'تسعة آلاف وتسعمائة', ru: 'Девять тысяч девятьсот' },
      },
      {
        question: { tr: '9000 + 990 = ?', en: '9000 + 990 = ?', es: '9000 + 990 = ?', de: '9000 + 990 = ?', fr: '9000 + 990 = ?', ar: '9000 + 990 = ?', ru: '9000 + 990 = ?' },
        answer: 9990,
        hint: { tr: 'Dokuz bin dokuz yüz doksan', en: 'Nine thousand nine hundred ninety', es: 'Nueve mil novecientos noventa', de: 'Neuntausendneunhundertneunzig', fr: 'Neuf mille neuf cent quatre-vingt-dix', ar: 'تسعة آلاف وتسعمائة وتسعون', ru: 'Девять тысяч девятьсот девяносто' },
      },
      {
        question: { tr: 'En büyük 4 basamaklı sayı?', en: 'Largest 4-digit number?', es: '¿Mayor número de 4 cifras?', de: 'Größte 4-stellige Zahl?', fr: 'Plus grand nombre à 4 chiffres ?', ar: 'أكبر عدد من 4 أرقام؟', ru: 'Наибольшее 4-значное число?' },
        answer: 9999,
        hint: { tr: 'Tüm basamaklar 9', en: 'All digits are 9', es: 'Todos los dígitos son 9', de: 'Alle Ziffern sind 9', fr: 'Tous les chiffres sont 9', ar: 'جميع الأرقام 9', ru: 'Все цифры — 9' },
      },
    ],
    bonusTop: {
      question: { tr: '500 × 2 + 100 = ?', en: '500 × 2 + 100 = ?', es: '500 × 2 + 100 = ?', de: '500 × 2 + 100 = ?', fr: '500 × 2 + 100 = ?', ar: '500 × 2 + 100 = ?', ru: '500 × 2 + 100 = ?' },
      answer: 1100,
      hint: { tr: 'Bin yüz', en: 'One thousand one hundred', es: 'Mil cien', de: 'Eintausendeinhundert', fr: 'Mille cent', ar: 'ألف ومئة', ru: 'Тысяча сто' },
    },
    bonusBottom: {
      question: { tr: '10000 − 11 = ?', en: '10000 − 11 = ?', es: '10000 − 11 = ?', de: '10000 − 11 = ?', fr: '10000 − 11 = ?', ar: '10000 − 11 = ?', ru: '10000 − 11 = ?' },
      answer: 9989,
      hint: { tr: 'Dokuz bin dokuz yüz seksen dokuz', en: 'Nine thousand nine hundred eighty-nine', es: 'Nueve mil novecientos ochenta y nueve', de: 'Neuntausendneunhundertneunundachtzig', fr: 'Neuf mille neuf cent quatre-vingt-neuf', ar: 'تسعة آلاف وتسعمائة وتسعة وثمانون', ru: 'Девять тысяч девятьсот восемьдесят девять' },
    },
  },
  {
    id: 2,
    category: 'history',
    title: { tr: 'Tarih Şeridi', en: 'Timeline', es: 'Línea del Tiempo', de: 'Zeitleiste', fr: 'Frise Chronologique', ar: 'شريط زمني', ru: 'Лента Времени' },
    icon: '📜',
    difficulty: 2,
    digits: 4,
    color: '#f59e0b',
    steps: [
      {
        question: { tr: 'İstanbul\'un fethinin gerçekleştiği yıl', en: 'Year of the Fall of Constantinople', es: 'Año de la caída de Constantinopla', de: 'Jahr des Falls von Konstantinopel', fr: 'Année de la chute de Constantinople', ar: 'سنة فتح القسطنطينية', ru: 'Год падения Константинополя' },
        answer: 1453,
        hint: { tr: 'Osmanlı Sultanı II. Mehmed tarafından fethedildi', en: 'Conquered by Ottoman Sultan Mehmed II', es: 'Conquistada por el sultán otomano Mehmed II', de: 'Erobert von Sultan Mehmed II.', fr: 'Conquise par le sultan ottoman Mehmed II', ar: 'فتحها السلطان العثماني محمد الثاني', ru: 'Завоёван султаном Мехмедом II' },
      },
      {
        question: { tr: '1453 + 500 = ?', en: '1453 + 500 = ?', es: '1453 + 500 = ?', de: '1453 + 500 = ?', fr: '1453 + 500 = ?', ar: '1453 + 500 = ?', ru: '1453 + 500 = ?' },
        answer: 1953,
        hint: { tr: 'İkinci Dünya Savaşı\'ndan 8 yıl sonra', en: '8 years after World War II', es: '8 años después de la Segunda Guerra Mundial', de: '8 Jahre nach dem Zweiten Weltkrieg', fr: '8 ans après la Seconde Guerre mondiale', ar: 'بعد 8 سنوات من الحرب العالمية الثانية', ru: 'Через 8 лет после Второй мировой' },
      },
      {
        question: { tr: 'John F. Kennedy\'nin suikaste uğradığı yıl', en: 'Year JFK was assassinated', es: 'Año del asesinato de JFK', de: 'Jahr der Ermordung von JFK', fr: 'Année de l\'assassinat de JFK', ar: 'سنة اغتيال جون كينيدي', ru: 'Год убийства Кеннеди' },
        answer: 1963,
        hint: { tr: 'Dallas, Texas\'ta gerçekleşti', en: 'It happened in Dallas, Texas', es: 'Ocurrió en Dallas, Texas', de: 'Es geschah in Dallas, Texas', fr: 'C\'est arrivé à Dallas, Texas', ar: 'حدث في دالاس، تكساس', ru: 'Произошло в Далласе, Техас' },
      },
      {
        question: { tr: 'İnsanlığın Ay\'a ilk kez ayak bastığı yıl', en: 'Year of the first Moon landing', es: 'Año del primer alunizaje', de: 'Jahr der ersten Mondlandung', fr: 'Année du premier alunissage', ar: 'سنة أول هبوط على القمر', ru: 'Год первой высадки на Луну' },
        answer: 1969,
        hint: { tr: 'Apollo 11 misyonu, Neil Armstrong', en: 'Apollo 11, Neil Armstrong', es: 'Apolo 11, Neil Armstrong', de: 'Apollo 11, Neil Armstrong', fr: 'Apollo 11, Neil Armstrong', ar: 'أبولو 11، نيل أرمسترونغ', ru: 'Аполлон-11, Нил Армстронг' },
      },
      {
        question: { tr: 'Berlin Duvarı\'nın yıkıldığı yıl', en: 'Year the Berlin Wall fell', es: 'Año de la caída del Muro de Berlín', de: 'Jahr des Mauerfalls', fr: 'Année de la chute du mur de Berlin', ar: 'سنة سقوط جدار برلين', ru: 'Год падения Берлинской стены' },
        answer: 1989,
        hint: { tr: 'Soğuk Savaş\'ın sembolik sonu', en: 'Symbolic end of the Cold War', es: 'Fin simbólico de la Guerra Fría', de: 'Symbolisches Ende des Kalten Krieges', fr: 'Fin symbolique de la Guerre froide', ar: 'النهاية الرمزية للحرب الباردة', ru: 'Символический конец Холодной войны' },
      },
    ],
    bonusTop: {
      question: { tr: '1400 + 3 = ?', en: '1400 + 3 = ?', es: '1400 + 3 = ?', de: '1400 + 3 = ?', fr: '1400 + 3 = ?', ar: '1400 + 3 = ?', ru: '1400 + 3 = ?' },
      answer: 1403,
      hint: { tr: 'Bin dört yüz üç', en: 'One thousand four hundred three', es: 'Mil cuatrocientos tres', de: 'Eintausendvierhundertdrei', fr: 'Mille quatre cent trois', ar: 'ألف وأربعمائة وثلاثة', ru: 'Тысяча четыреста три' },
    },
    bonusBottom: {
      question: { tr: '1900 + 80 = ?', en: '1900 + 80 = ?', es: '1900 + 80 = ?', de: '1900 + 80 = ?', fr: '1900 + 80 = ?', ar: '1900 + 80 = ?', ru: '1900 + 80 = ?' },
      answer: 1980,
      hint: { tr: 'Bin dokuz yüz seksen', en: 'One thousand nine hundred eighty', es: 'Mil novecientos ochenta', de: 'Eintausendneunhundertachtzig', fr: 'Mille neuf cent quatre-vingts', ar: 'ألف وتسعمائة وثمانون', ru: 'Тысяча девятьсот восемьдесят' },
    },
  },
  {
    id: 3,
    category: 'science',
    title: { tr: 'Güç ve İcat', en: 'Power & Invention', es: 'Poder e Invención', de: 'Macht & Erfindung', fr: 'Puissance & Invention', ar: 'القوة والاختراع', ru: 'Сила и Изобретения' },
    icon: '⚡',
    difficulty: 3,
    digits: 4,
    color: '#f87171',
    steps: [
      {
        question: { tr: '2¹² (2\'nin 12. kuvveti) = ?', en: '2¹² (2 to the 12th power) = ?', es: '2¹² (2 elevado a 12) = ?', de: '2¹² (2 hoch 12) = ?', fr: '2¹² (2 puissance 12) = ?', ar: '2¹² (2 أس 12) = ?', ru: '2¹² (2 в 12-й степени) = ?' },
        answer: 4096,
        hint: { tr: 'Bilgisayar dünyasında sık kullanılan bir güç', en: 'A power commonly used in computing', es: 'Una potencia común en informática', de: 'Eine häufig verwendete Potenz in der IT', fr: 'Une puissance courante en informatique', ar: 'قوة شائعة في عالم الحاسوب', ru: 'Степень, часто используемая в вычислениях' },
      },
      {
        question: { tr: '4096 − 3000 = ?', en: '4096 − 3000 = ?', es: '4096 − 3000 = ?', de: '4096 − 3000 = ?', fr: '4096 − 3000 = ?', ar: '4096 − 3000 = ?', ru: '4096 − 3000 = ?' },
        answer: 1096,
        hint: { tr: 'Bin doksan altı', en: 'One thousand ninety-six', es: 'Mil noventa y seis', de: 'Eintausendsechsundneunzig', fr: 'Mille quatre-vingt-seize', ar: 'ألف وستة وتسعون', ru: 'Тысяча девяносто шесть' },
      },
      {
        question: { tr: '1096 + 700 = ?', en: '1096 + 700 = ?', es: '1096 + 700 = ?', de: '1096 + 700 = ?', fr: '1096 + 700 = ?', ar: '1096 + 700 = ?', ru: '1096 + 700 = ?' },
        answer: 1796,
        hint: { tr: 'On yedi yüz doksan altı', en: 'One thousand seven hundred ninety-six', es: 'Mil setecientos noventa y seis', de: 'Eintausendsiebenhundertsechsundneunzig', fr: 'Mille sept cent quatre-vingt-seize', ar: 'ألف وسبعمائة وستة وتسعون', ru: 'Тысяча семьсот девяносто шесть' },
      },
      {
        question: { tr: 'Amerika\'nın Bağımsızlık Bildirisi\'nin ilan edildiği yıl', en: 'Year of the US Declaration of Independence', es: 'Año de la Declaración de Independencia de EE.UU.', de: 'Jahr der US-Unabhängigkeitserklärung', fr: 'Année de la Déclaration d\'indépendance des États-Unis', ar: 'سنة إعلان استقلال أمريكا', ru: 'Год Декларации независимости США' },
        answer: 1776,
        hint: { tr: '4 Temmuz, Thomas Jefferson', en: 'July 4th, Thomas Jefferson', es: '4 de julio, Thomas Jefferson', de: '4. Juli, Thomas Jefferson', fr: '4 juillet, Thomas Jefferson', ar: '4 يوليو، توماس جيفرسون', ru: '4 июля, Томас Джефферсон' },
      },
      {
        question: { tr: 'Alexander Graham Bell\'in telefonu icat ettiği yıl', en: 'Year Alexander Graham Bell invented the telephone', es: 'Año en que Bell inventó el teléfono', de: 'Jahr der Erfindung des Telefons durch Bell', fr: 'Année de l\'invention du téléphone par Bell', ar: 'سنة اختراع بيل للهاتف', ru: 'Год изобретения телефона Беллом' },
        answer: 1876,
        hint: { tr: 'İletişim tarihinin dönüm noktası', en: 'A milestone in communication history', es: 'Un hito en la historia de la comunicación', de: 'Ein Meilenstein der Kommunikationsgeschichte', fr: 'Un tournant dans l\'histoire des communications', ar: 'نقطة تحول في تاريخ الاتصالات', ru: 'Поворотный момент в истории связи' },
      },
    ],
    bonusTop: {
      question: { tr: '5000 + 96 = ?', en: '5000 + 96 = ?', es: '5000 + 96 = ?', de: '5000 + 96 = ?', fr: '5000 + 96 = ?', ar: '5000 + 96 = ?', ru: '5000 + 96 = ?' },
      answer: 5096,
      hint: { tr: 'Beş bin doksan altı', en: 'Five thousand ninety-six', es: 'Cinco mil noventa y seis', de: 'Fünftausendsechsundneunzig', fr: 'Cinq mille quatre-vingt-seize', ar: 'خمسة آلاف وستة وتسعون', ru: 'Пять тысяч девяносто шесть' },
    },
    bonusBottom: {
      question: { tr: '9999 − 123 = ?', en: '9999 − 123 = ?', es: '9999 − 123 = ?', de: '9999 − 123 = ?', fr: '9999 − 123 = ?', ar: '9999 − 123 = ?', ru: '9999 − 123 = ?' },
      answer: 9876,
      hint: { tr: 'Dokuz bin sekiz yüz yetmiş altı', en: 'Nine thousand eight hundred seventy-six', es: 'Nueve mil ochocientos setenta y seis', de: 'Neuntausendachthundertsechsundsiebzig', fr: 'Neuf mille huit cent soixante-seize', ar: 'تسعة آلاف وثمانمائة وستة وسبعون', ru: 'Девять тысяч восемьсот семьдесят шесть' },
    },
  },
];

export const categories = [
  {
    id: 'math',
    title: { tr: 'Matematik', en: 'Mathematics', es: 'Matemáticas', de: 'Mathematik', fr: 'Mathématiques', ar: 'الرياضيات', ru: 'Математика' },
    icon: '🔢',
    color: '#4ade80',
  },
  {
    id: 'history',
    title: { tr: 'Tarih', en: 'History', es: 'Historia', de: 'Geschichte', fr: 'Histoire', ar: 'التاريخ', ru: 'История' },
    icon: '📜',
    color: '#f59e0b',
  },
  {
    id: 'science',
    title: { tr: 'Bilim & Teknoloji', en: 'Science & Tech', es: 'Ciencia y Tecnología', de: 'Wissenschaft & Technik', fr: 'Science & Tech', ar: 'العلوم والتقنية', ru: 'Наука и Техника' },
    icon: '⚡',
    color: '#f87171',
  },
];

export function getLevelsByCategory(categoryId) {
  return allLevels.filter((l) => l.category === categoryId);
}

// Flat list of all levels (for leaderboard etc.)
export const levels = allLevels;
