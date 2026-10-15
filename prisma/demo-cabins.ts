type DemoCabin = {
  slug: string;
  region: string;
  title: [string, string, string];
  description: [string, string, string];
  price: number;
  guests: number;
  bedrooms: number;
  photos: string[];
  amenities: string[];
};

// Concept properties and illustrative images; none represents an actual rental listing.
export const demoCabins: DemoCabin[] = [
  {
    slug: "demo-kol-nur", region: "issyk-kul", title: ["Көл Нур", "Көл Нур", "Kol Nur"],
    description: [
      "Светлый A-frame для спокойных выходных у озера: панорамное остекление, уютная спальня и открытая терраса. Пространство для двоих с кухней и местом для утреннего кофе. Демонстрационный концепт, фотографии иллюстративные.",
      "Көл жээгиндеги тынч дем алыш үчүн жарык A-frame: панорамалык терезелер, жайлуу уктоочу бөлмө жана ачык терраса. Эки адамга ылайыктуу ашкана жана эртең менен кофе ичүүгө орун. Бул көрсөтмө концепт, сүрөттөр мисал катары берилген.",
      "A light-filled A-frame concept for a quiet lakeside weekend, with panoramic glazing, a cosy bedroom and an open terrace. A kitchen and a morning coffee corner complete this retreat for two. Demonstration concept with illustrative photographs.",
    ], price: 4500, guests: 2, bedrooms: 1,
    photos: ["cabin-lake.webp", "cabin-escape.webp", "kyrgyzstan-issyk-kul.webp"],
    amenities: ["kitchen", "terrace", "wifi", "parking"],
  },
  {
    slug: "demo-pine-house", region: "chon-kemin", title: ["Сосновый дом", "Карагай үйү", "Pine House"],
    description: [
      "Деревянный A-frame среди деревьев, задуманный для семейного отдыха в Чон-Кемине. Две спальни, тёплая гостиная и терраса объединяют домашний комфорт и природу. Демонстрационный концепт, фотографии иллюстративные.",
      "Чоң-Кеминде үй-бүлөлүк эс алуу үчүн дарактардын арасындагы жыгач A-frame концепти. Эки уктоочу бөлмө, жылуу конок бөлмөсү жана терраса үйдүн жайлуулугун табият менен айкалыштырат. Бул көрсөтмө концепт, сүрөттөр мисал катары берилген.",
      "A timber A-frame concept among the trees for a family stay in Chon-Kemin. Two bedrooms, a warm living room and a terrace bring together home comforts and nature. Demonstration concept with illustrative photographs.",
    ], price: 6200, guests: 4, bedrooms: 2,
    photos: ["cabin-forest.webp", "cabin-hideaway.webp", "kyrgyzstan-chon-kemin.webp"],
    amenities: ["wifi", "kitchen", "heating", "terrace", "parking"],
  },
  {
    slug: "demo-karakol-loft", region: "karakol", title: ["Каракол Лофт", "Каракол Лофт", "Karakol Loft"],
    description: [
      "Минималистичный горный дом с высоким потолком, антресолью и просторной зоной отдыха. Концепция для путешествий в Каракол: кухня, отопление и большие окна с видом на природу. Демонстрационный объект, фотографии не относятся к реальному предложению аренды.",
      "Бийик шыптуу, антресоль жана кенен эс алуу аянты бар минималисттик тоо үйүнүн концепти. Караколго саякат үчүн ашкана, жылытуу жана табиятты караган чоң терезелер каралган. Көрсөтмө объект, сүрөттөр чыныгы ижара сунушуна тиешелүү эмес.",
      "A minimal mountain home concept with a high ceiling, a mezzanine and a generous living area. Designed for trips to Karakol, with a kitchen, heating and large windows towards nature. Demonstration property; photos do not depict an actual rental offer.",
    ], price: 7800, guests: 4, bedrooms: 2,
    photos: ["cabin-mountain.webp", "cabin-valley.webp", "kyrgyzstan-karakol.webp"],
    amenities: ["heating", "kitchen", "wifi", "parking"],
  },
  {
    slug: "demo-sary-oi", region: "issyk-kul", title: ["Сары-Ой", "Сары-Ой", "Sary-Oi"],
    description: [
      "Просторный A-frame для семьи или небольшой компании: три спальни, общая кухня и терраса для долгих летних вечеров. Иллюстрация отдыха на Иссык-Куле, а не реальный сдаваемый объект.",
      "Үй-бүлө же чакан топ үчүн кенен A-frame: үч уктоочу бөлмө, жалпы ашкана жана узак жайкы кечтер үчүн терраса. Ысык-Көлдө эс алуунун мисалы, чыныгы ижара объекти эмес.",
      "A spacious A-frame concept for a family or a small group: three bedrooms, a shared kitchen and a terrace for long summer evenings. An illustration of a stay at Issyk-Kul, rather than a real rental property.",
    ], price: 9500, guests: 6, bedrooms: 3,
    photos: ["cabin-escape.webp", "cabin-lake.webp", "kyrgyzstan-issyk-kul.webp"],
    amenities: ["terrace", "kitchen", "parking", "wifi", "heating"],
  },
  {
    slug: "demo-archa-retreat", region: "ala-archa", title: ["Арча Retreat", "Арча Retreat", "Archa Retreat"],
    description: [
      "Компактное укрытие для двоих, вдохновлённое хвойными лесами Ала-Арчи. Тёплое дерево, открытая терраса и тихая гостиная создают атмосферу медленного отдыха. Демонстрационный концепт с иллюстративными изображениями.",
      "Ала-Арчанын ийне жалбырактуу токойлорунан шыктанган эки адамдык чакан үйдүн концепти. Жылуу жыгач, ачык терраса жана тынч конок бөлмөсү жай эс алууга ылайыктуу. Иллюстрациялык сүрөттөр менен көрсөтмө концепт.",
      "A compact retreat for two inspired by the conifer forests of Ala-Archa. Warm timber, an open terrace and a quiet living space evoke a slower kind of holiday. Demonstration concept with illustrative images.",
    ], price: 5200, guests: 2, bedrooms: 1,
    photos: ["cabin-hideaway.webp", "cabin-forest.webp", "kyrgyzstan-ala-archa.webp"],
    amenities: ["terrace", "heating", "kitchen", "parking"],
  },
  {
    slug: "demo-naryn-sky", region: "naryn", title: ["Нарын Sky", "Нарын Sky", "Naryn Sky"],
    description: [
      "Дом с открытой планировкой, вдохновлённый широкими долинами Нарына. Две спальни, большие окна и отопление для прохладных вечеров. Только демонстрация интерфейса; расположение и изображения не подтверждают реальное предложение.",
      "Нарындын кең өрөөндөрүнөн шыктанган ачык пландуу үйдүн концепти. Эки уктоочу бөлмө, чоң терезелер жана салкын кечтер үчүн жылытуу каралган. Интерфейсти көрсөтүү үчүн гана; жайгашкан жери жана сүрөттөр чыныгы сунушту ырастабайт.",
      "An open-plan home concept inspired by Naryn's wide valleys. Two bedrooms, large windows and heating for cooler evenings. For interface demonstration only; its location and images do not establish an actual rental offer.",
    ], price: 6800, guests: 4, bedrooms: 2,
    photos: ["cabin-valley.webp", "cabin-mountain.webp", "kyrgyzstan-naryn.webp"],
    amenities: ["heating", "parking", "kitchen", "terrace"],
  },
  {
    slug: "demo-kemin-hideaway", region: "chon-kemin", title: ["Кемин Hideaway", "Кемин Hideaway", "Kemin Hideaway"],
    description: [
      "Небольшой дом среди зелени для тихого отдыха вдвоём. Кухня, уютная зона сна и деревянная терраса с местом для чтения. Демонстрационный концепт для Чон-Кемина; изображения не являются фотографиями сдаваемого жилья.",
      "Эки адамдын тынч эс алуусу үчүн жашыл бактардын арасындагы чакан үйдүн концепти. Ашкана, жайлуу уктоо аянты жана китеп окууга орун бар жыгач терраса. Чоң-Кемин үчүн көрсөтмө концепт; сүрөттөр ижарадагы үйдү көрсөтпөйт.",
      "A small home concept among greenery for a quiet getaway for two. A kitchen, a cosy sleeping area and a timber terrace with space to read. Demonstration concept for Chon-Kemin; images are not photographs of a rental property.",
    ], price: 3900, guests: 2, bedrooms: 1,
    photos: ["story.webp", "cabin-forest.webp", "kyrgyzstan-chon-kemin.webp"],
    amenities: ["terrace", "kitchen", "parking"],
  },
  {
    slug: "demo-osh-horizon", region: "osh", title: ["Ош Horizon", "Ош Horizon", "Osh Horizon"],
    description: [
      "Семейный A-frame концепт, вдохновлённый природой юга Кыргызстана. Просторная гостиная, две спальни и кухня для неспешных завтраков. Объект и фотографии служат демонстрации и не доступны для реального платного проживания.",
      "Кыргызстандын түштүгүнүн табиятынан шыктанган үй-бүлөлүк A-frame концепти. Кенен конок бөлмөсү, эки уктоочу бөлмө жана жай эртең мененки тамак үчүн ашкана. Объект жана сүрөттөр көрсөтмө үчүн, чыныгы акы төлөнүүчү жашоого жеткиликтүү эмес.",
      "A family A-frame concept inspired by the landscapes of southern Kyrgyzstan. A generous living room, two bedrooms and a kitchen for unhurried breakfasts. The property and photos are for demonstration and are unavailable for a real paid stay.",
    ], price: 7200, guests: 5, bedrooms: 2,
    photos: ["hero.webp", "cabin-valley.webp", "kyrgyzstan-osh.webp"],
    amenities: ["kitchen", "parking", "wifi", "terrace"],
  },
  {
    slug: "demo-jeti-oguz", region: "karakol", title: ["Жети-Огуз Lodge", "Жети-Өгүз Lodge", "Jeti-Oguz Lodge"],
    description: [
      "A-frame концепт для компании из шести человек с тремя спальнями и большой общей зоной. Деревянная отделка и терраса вдохновлены поездками в горы рядом с Караколом. Демонстрационный объект с иллюстративной галереей.",
      "Үч уктоочу бөлмөсү жана чоң жалпы аянты бар алты адамдык A-frame концепти. Жыгач жасалгасы жана террасасы Караколго жакын тоолорго саякаттардан шыктанган. Иллюстрациялык галереясы бар көрсөтмө объект.",
      "An A-frame concept for six guests, with three bedrooms and a generous shared living space. Timber finishes and a terrace are inspired by mountain trips near Karakol. Demonstration property with an illustrative gallery.",
    ], price: 10800, guests: 6, bedrooms: 3,
    photos: ["cabin-mountain.webp", "cabin-escape.webp", "kyrgyzstan-karakol.webp"],
    amenities: ["heating", "terrace", "wifi", "kitchen", "parking"],
  },
  {
    slug: "demo-song-kol", region: "naryn", title: ["Сон-Көл Escape", "Соң-Көл Escape", "Song-Kol Escape"],
    description: [
      "Лаконичный дом для пары, вдохновлённый простором высокогорного озера Сон-Көл. Тёплая спальня, компактная кухня и терраса для созерцания природы. Демонстрационная концепция; реальное размещение и платежи недоступны.",
      "Соң-Көлдүн бийик тоолуу кеңдигинен шыктанган эки адамдык жөнөкөй үйдүн концепти. Жылуу уктоочу бөлмө, чакан ашкана жана табиятка суктануу үчүн терраса. Көрсөтмө концепт; чыныгы жайгаштыруу жана төлөмдөр жеткиликтүү эмес.",
      "A pared-back home concept for a couple, inspired by the openness of high-altitude Song-Kol. A warm bedroom, a compact kitchen and a terrace for enjoying nature. Demonstration concept; real accommodation and payments are unavailable.",
    ], price: 5800, guests: 2, bedrooms: 1,
    photos: ["cabin-lake.webp", "cabin-hideaway.webp", "kyrgyzstan-naryn.webp"],
    amenities: ["heating", "terrace", "kitchen", "parking"],
  },
];
