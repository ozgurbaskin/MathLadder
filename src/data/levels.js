export const levels = [
  {
    id: 1,
    title: 'Basamak Basamak',
    subtitle: 'Kolay · 4 Basamak',
    description: 'Her adımda sadece bir basamak değişiyor. Sıfırdan dokuza tırmanalım!',
    digits: 4,
    color: '#4ade80',
    steps: [
      {
        question: '10 × 10 × 10 = ?',
        answer: 1000,
        hint: "On'un üçüncü kuvveti",
      },
      {
        question: '9 × 1000 = ?',
        answer: 9000,
        hint: 'Dokuz bin',
      },
      {
        question: '9000 + 900 = ?',
        answer: 9900,
        hint: 'Dokuz bin + dokuz yüz',
      },
      {
        question: '9000 + 990 = ?',
        answer: 9990,
        hint: 'Dokuz bin dokuz yüz doksan',
      },
      {
        question: 'En büyük 4 basamaklı sayı?',
        answer: 9999,
        hint: 'Tüm basamaklar 9',
      },
    ],
  },
  {
    id: 2,
    title: 'Tarih Şeridi',
    subtitle: 'Orta · 4 Basamak',
    description: 'Tarihin önemli dönüm noktaları. Her adımda sadece bir yıl rakamı değişiyor.',
    digits: 4,
    color: '#f59e0b',
    steps: [
      {
        question: 'İstanbul\'un fethinin gerçekleştiği yıl',
        answer: 1453,
        hint: 'Osmanlı Sultanı II. Mehmed tarafından fethedildi',
      },
      {
        question: '1453 + 500 = ?',
        answer: 1953,
        hint: 'İkinci Dünya Savaşı\'ndan 8 yıl sonra',
      },
      {
        question: 'John F. Kennedy\'nin suikaste uğradığı yıl',
        answer: 1963,
        hint: 'Dallas, Texas\'ta gerçekleşti',
      },
      {
        question: 'İnsanlığın Ay\'a ilk kez ayak bastığı yıl',
        answer: 1969,
        hint: 'Apollo 11 misyonu, Neil Armstrong',
      },
      {
        question: 'Berlin Duvarı\'nın yıkıldığı yıl',
        answer: 1989,
        hint: 'Soğuk Savaş\'ın sembolik sonu',
      },
    ],
  },
  {
    id: 3,
    title: 'Güç ve İcat',
    subtitle: 'Zor · 4 Basamak',
    description: 'Matematik dehası ve tarihin büyük icatları bir arada. Hazır mısın?',
    digits: 4,
    color: '#f87171',
    steps: [
      {
        question: '2¹² (2\'nin 12. kuvveti) = ?',
        answer: 4096,
        hint: 'Bilgisayar dünyasında sık kullanılan bir güç',
      },
      {
        question: '4096 − 3000 = ?',
        answer: 1096,
        hint: 'Bin doksan altı',
      },
      {
        question: '1096 + 700 = ?',
        answer: 1796,
        hint: 'On yedi yüz doksan altı',
      },
      {
        question: 'Amerika\'nın Bağımsızlık Bildirisi\'nin ilan edildiği yıl',
        answer: 1776,
        hint: '4 Temmuz, Thomas Jefferson',
      },
      {
        question: 'Alexander Graham Bell\'in telefonu icat ettiği yıl',
        answer: 1876,
        hint: 'İletişim tarihinin dönüm noktası',
      },
    ],
  },
];
