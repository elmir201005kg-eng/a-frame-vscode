import type { Translation } from "./demo-cabin-details";

export type DemoCabin = {
  slug: string; region: string; title: Translation; description: Translation;
  settlement: Translation; city?: boolean; price: number;
  guests: number; bedrooms: number; beds: number; bathrooms: number; photos: string[];
};

// Exactly eight fictional properties. Stock photos illustrate concepts,
// rather than actual rental accommodation at the fictional addresses below.
const collection: DemoCabin[] = [
  {
    slug: "demo-a-frame-ala-too", region: "chui",
    title: ["A-Frame Ala-Too", "A-Frame Ala-Too", "A-Frame Ala-Too"],
    settlement: ["Беш-Кунгей", "Беш-Күңгөй", "Besh-Kungey"],
    description: [
      "Светлый A-Frame, вдохновлённый предгорьями Ала-Тоо: высокий треугольный потолок, панорамные окна и тёплое дерево создают пространство для спокойных выходных. Две спальни с двуспальными кроватями, гостиная с мягким диваном и кухня рассчитаны на четырёх гостей. На открытой террасе приятно читать и встречать закат; отопление, Wi-Fi и парковка дополняют домашний комфорт. Примерная цена — 5 000 сом за ночь. Это вымышленный демо-домик; фотографии иллюстративные, бронирование и оплата недоступны.",
      "Ала-Тоонун этектеринен шыктанган жарык A-Frame: бийик үч бурчтуу шып, панорамалык терезелер жана жылуу жыгач жасалгасы тынч дем алышка чакырат. Эки кишилик керебеттери бар эки уктоочу бөлмө, жумшак дивандуу конок бөлмөсү жана ашкана төрт конокко ылайыкталган. Ачык террасада китеп окуп, күндүн батышын көрүүгө болот; жылытуу, Wi-Fi жана унаа токтотуучу жай ыңгайлуулукту толуктайт. Болжолдуу баасы — түнүнө 5 000 сом. Бул ойдон чыгарылган демо-үй; сүрөттөр иллюстрациялык, ээлөө жана төлөм жеткиликсиз.",
      "A light-filled A-Frame inspired by the foothills of Ala-Too, with a soaring triangular ceiling, panoramic windows and warm timber finishes. Two double bedrooms, a soft-sofa lounge and a kitchen accommodate four concept guests. An open terrace invites reading and sunset watching, while heating, Wi-Fi and parking complete the home comforts. Indicative price: KGS 5,000 per night. This fictional demo cabin uses illustrative stock photos; booking and payment are unavailable.",
    ],
    price: 5000, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    photos: ["demo-ala-too.webp", "demo-interior-timber.webp", "kyrgyzstan-ala-archa.webp"],
  },
  {
    slug: "demo-black-diamond", region: "issyk-kul",
    title: ["Black Diamond", "Black Diamond", "Black Diamond"],
    settlement: ["Чолпон-Ата", "Чолпон-Ата", "Cholpon-Ata"], city: true,
    description: [
      "Выразительный A-Frame в графитовой палитре, вдохновлённый отдыхом на Иссык-Куле. Большое остекление, дерево и мягкий вечерний свет создают камерную атмосферу. Две спальни с двуспальными кроватями и раскладной диван в гостиной рассчитаны на шесть гостей; две ванные помогают комфортно собираться утром. Кухня, терраса, отопление, Wi-Fi и парковка делают концепт удобным для долгих выходных. Примерная цена — 8 000 сом за ночь. Демо-объект вымышленный; фото иллюстративные, реальные бронирования и платежи отключены.",
      "Ысык-Көлдөгү эс алуудан шыктанган графит түстүү көркөм A-Frame. Чоң терезелер, жыгач жана кечки жумшак жарык жайлуу маанай түзөт. Эки кишилик керебеттери бар эки уктоочу бөлмө жана конок бөлмөсүндөгү жайылма диван алты конокко ылайыкталган; эки жуунучу бөлмө эртең менен ыңгайлуу. Ашкана, терраса, жылытуу, Wi-Fi жана унаа токтотуучу жай узак дем алыш үчүн каралган. Болжолдуу баасы — түнүнө 8 000 сом. Бул ойдон чыгарылган демо-объект; сүрөттөр иллюстрациялык, чыныгы ээлөө жана төлөм өчүрүлгөн.",
      "A striking graphite-toned A-Frame inspired by escapes to Issyk-Kul. Generous glazing, timber and soft evening lighting create an intimate atmosphere. Two double bedrooms and a sofa bed in the lounge accommodate six concept guests; two bathrooms make mornings easier. A kitchen, terrace, heating, Wi-Fi and parking suit long weekends. Indicative price: KGS 8,000 per night. This fictional demo property uses illustrative stock photos; real bookings and payments are disabled.",
    ],
    price: 8000, guests: 6, bedrooms: 2, beds: 3, bathrooms: 2,
    photos: ["demo-black-diamond.webp", "demo-interior-lounge.webp", "kyrgyzstan-issyk-kul.webp"],
  },
  {
    slug: "demo-sky-house", region: "chui",
    title: ["Sky House", "Sky House", "Sky House"],
    settlement: ["Кой-Таш", "Кой-Таш", "Koi-Tash"],
    description: [
      "Воздушный домик с высоким сводом, светлой деревянной отделкой и окнами, которые словно обрамляют небо. Sky House задуман для неспешных выходных в Чуйской области: две отдельные спальни на четырёх гостей, общая гостиная и кухня с обеденным столом. На террасе можно устроить долгий завтрак, а вечером собраться за настольными играми. Предусмотрены отопление, Wi-Fi, парковка и ванная комната. Примерная цена — 6 500 сом за ночь. Домик вымышленный, фотографии иллюстративные; бронирование и оплата недоступны.",
      "Бийик шыптуу, ачык түстүү жыгач жасалгалуу жана асманды алкактагандай терезелери бар жарык үй. Sky House концепти Чүй облусундагы шашпаган дем алыш үчүн түзүлгөн: төрт конокко эки өзүнчө уктоочу бөлмө, жалпы конок бөлмөсү жана тамактануучу үстөлү бар ашкана. Террасада жай эртең мененки тамак ичип, кечинде үстөл оюндарын ойноого болот. Жылытуу, Wi-Fi, унаа токтотуучу жай жана жуунучу бөлмө каралган. Болжолдуу баасы — түнүнө 6 500 сом. Бул ойдон чыгарылган демо-үй; сүрөттөр иллюстрациялык, ээлөө жана төлөм жеткиликсиз.",
      "An airy cabin with a lofty ceiling, pale timber and windows that seem to frame the sky. Sky House imagines an unhurried weekend in Chuy Region: two separate bedrooms for four guests, a shared lounge and a kitchen with a dining table. The terrace is made for long breakfasts, followed by evening board games indoors. Heating, Wi-Fi, parking and a bathroom complete the concept. Indicative price: KGS 6,500 per night. This fictional demo cabin has illustrative photos; booking and payment are unavailable.",
    ],
    price: 6500, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    photos: ["demo-sky-house.webp", "demo-interior-kitchen.webp", "kyrgyzstan-ala-archa.webp"],
  },
  {
    slug: "demo-mountain-view", region: "naryn",
    title: ["Mountain View", "Mountain View", "Mountain View"],
    settlement: ["Нарын", "Нарын", "Naryn"], city: true,
    description: [
      "Горный A-Frame, вдохновлённый широкими долинами и прохладными вечерами Нарына. Тёплый интерьер сочетает натуральное дерево, мягкие пледы и большую общую зону для разговоров за чаем. Две спальни с двумя двуспальными и одной односпальной кроватью рассчитаны на пять гостей. В концепте есть кухня, ванная, отопление, Wi-Fi и парковка; терраса продолжает жилое пространство на свежем воздухе. Примерная цена — 7 000 сом за ночь. Это вымышленное демо-предложение: фото иллюстративные, бронирования и платежи не принимаются.",
      "Нарындын кең өрөөндөрүнөн жана салкын кечтеринен шыктанган тоо A-Frame. Жылуу ички жасалга табигый жыгачты, жумшак жууркандарды жана чай үстүндө баарлашууга ылайык чоң жалпы аянтты бириктирет. Эки уктоочу бөлмөдөгү эки кишилик эки жана бир кишилик бир керебет беш конокко ылайык. Концептте ашкана, жуунучу бөлмө, жылытуу, Wi-Fi жана унаа токтотуучу жай бар; терраса таза абада эс алууга арналган. Болжолдуу баасы — түнүнө 7 000 сом. Бул ойдон чыгарылган демо-сунуш: сүрөттөр иллюстрациялык, ээлөө жана төлөм кабыл алынбайт.",
      "A mountain A-Frame inspired by Naryn's wide valleys and cool evenings. Natural timber, soft blankets and a generous lounge set the scene for conversations over tea. Two bedrooms with two double beds and one single bed accommodate five concept guests. A kitchen, bathroom, heating, Wi-Fi and parking are included, with a terrace extending the living space outdoors. Indicative price: KGS 7,000 per night. This fictional demo listing has illustrative photos; bookings and payments are not accepted.",
    ],
    price: 7000, guests: 5, bedrooms: 2, beds: 3, bathrooms: 1,
    photos: ["demo-mountain-view.webp", "demo-interior-timber.webp", "kyrgyzstan-naryn.webp"],
  },
  {
    slug: "demo-pine-forest", region: "issyk-kul",
    title: ["Pine Forest", "Pine Forest", "Pine Forest"],
    settlement: ["Григорьевка", "Григорьевка", "Grigorievka"],
    description: [
      "Уютный A-Frame в природной палитре, вдохновлённый хвойными ущельями Иссык-Куля. Деревянные поверхности, зелёные акценты и панорамное окно создают атмосферу лесного убежища. Две спальни с двуспальными кроватями рассчитаны на четырёх гостей, а кухня и гостиная объединяют компанию за ужином. Терраса задумана для чтения и утреннего кофе; предусмотрены ванная, отопление, Wi-Fi и парковка. Примерная цена — 5 500 сом за ночь. Это вымышленный демо-концепт с иллюстративными фото; реальные бронирования и оплата отключены.",
      "Ысык-Көлдүн ийне жалбырактуу капчыгайларынан шыктанган табигый түстөгү жайлуу A-Frame. Жыгач беттер, жашыл өңдөр жана панорамалык терезе токойдогу эс алуу жайынын маанайын түзөт. Эки кишилик керебеттери бар эки уктоочу бөлмө төрт конокко ылайык, ал эми ашкана жана конок бөлмөсү кечки тамакка чогултат. Терраса китеп окууга жана эртең менен кофе ичүүгө арналган; жуунучу бөлмө, жылытуу, Wi-Fi жана унаа токтотуучу жай каралган. Болжолдуу баасы — түнүнө 5 500 сом. Бул ойдон чыгарылган демо-концепт; сүрөттөр иллюстрациялык, чыныгы ээлөө жана төлөм өчүрүлгөн.",
      "A cosy, nature-toned A-Frame inspired by the conifer-lined gorges of Issyk-Kul. Timber, quiet green accents and a panoramic window evoke a woodland refuge. Two double bedrooms suit four concept guests, while the kitchen and lounge bring everyone together for dinner. The terrace is designed for reading and morning coffee; a bathroom, heating, Wi-Fi and parking are included. Indicative price: KGS 5,500 per night. This fictional demo concept uses illustrative photos; real bookings and payments are disabled.",
    ],
    price: 5500, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1,
    photos: ["demo-pine-forest.webp", "demo-interior-kitchen.webp", "kyrgyzstan-chon-kemin.webp"],
  },
  {
    slug: "demo-alpine-luxury", region: "karakol",
    title: ["Alpine Luxury", "Alpine Luxury", "Alpine Luxury"],
    settlement: ["Каракол", "Каракол", "Karakol"], city: true,
    description: [
      "Просторный A-Frame премиального настроения, вдохновлённый пейзажами Каракола. Высокая гостиная с большим остеклением, натуральные материалы и мягкая мебель создают место для отдыха большой семьи. Три спальни с тремя двуспальными и двумя односпальными кроватями рассчитаны на восемь гостей; предусмотрены две ванные. Просторная кухня, обеденная зона и терраса дополнены отоплением, Wi-Fi и парковкой. Примерная цена — 12 000 сом за ночь. Это вымышленный демо-домик; фото иллюстративные, бронирования и платежи недоступны.",
      "Караколдун пейзаждарынан шыктанган, өзгөчө жайлуулукту элестеткен кенен A-Frame. Чоң терезелүү бийик конок бөлмөсү, табигый материалдар жана жумшак эмерек чоң үй-бүлөнүн эс алуусуна ылайыкталган. Үч уктоочу бөлмөдөгү эки кишилик үч жана бир кишилик эки керебет сегиз конокко эсептелген; эки жуунучу бөлмө каралган. Кең ашкана, тамактануу аянты жана терраса жылытуу, Wi-Fi жана унаа токтотуучу жай менен толукталат. Болжолдуу баасы — түнүнө 12 000 сом. Бул ойдон чыгарылган демо-үй; сүрөттөр иллюстрациялык, ээлөө жана төлөм жеткиликсиз.",
      "A spacious A-Frame with a refined alpine mood inspired by Karakol. A double-height lounge with generous glazing, natural materials and soft furniture imagines a retreat for a larger family. Three bedrooms contain three double beds and two single beds for eight concept guests, with two bathrooms. A broad kitchen, dining area and terrace are complemented by heating, Wi-Fi and parking. Indicative price: KGS 12,000 per night. This fictional demo cabin has illustrative photos; bookings and payments are unavailable.",
    ],
    price: 12000, guests: 8, bedrooms: 3, beds: 5, bathrooms: 2,
    photos: ["demo-alpine-luxury.webp", "demo-interior-lounge.webp", "kyrgyzstan-karakol.webp"],
  },
  {
    slug: "demo-nomad-house", region: "osh",
    title: ["Nomad House", "Nomad House", "Nomad House"],
    settlement: ["Ош", "Ош", "Osh"], city: true,
    description: [
      "Небольшой A-Frame с тёплым южным настроением и деталями, вдохновлёнными кыргызским гостеприимством. Натуральное дерево, мягкий текстиль и уютная обеденная зона создают домашнюю атмосферу. В спальне предусмотрены двуспальная и односпальная кровати для трёх гостей; рядом расположены кухня и ванная. Терраса подходит для вечернего чая, а отопление, Wi-Fi и парковка дополняют удобства. Примерная цена — 4 500 сом за ночь. Nomad House — вымышленный демо-домик: фото иллюстративные, бронирования и платежи отключены.",
      "Кыргыз меймандостугунан шыктанган кооздуктары жана түштүктүн жылуу маанайы бар чакан A-Frame. Табигый жыгач, жумшак кездемелер жана жайлуу тамактануу аянты үйдөгүдөй маанай түзөт. Уктоочу бөлмөдө үч конок үчүн эки кишилик жана бир кишилик керебет каралган; жанында ашкана жана жуунучу бөлмө жайгашкан. Терраса кечки чайга ылайык, ал эми жылытуу, Wi-Fi жана унаа токтотуучу жай ыңгайлуулукту толуктайт. Болжолдуу баасы — түнүнө 4 500 сом. Nomad House — ойдон чыгарылган демо-үй: сүрөттөр иллюстрациялык, ээлөө жана төлөм өчүрүлгөн.",
      "A small A-Frame with a warm southern mood and details inspired by Kyrgyz hospitality. Natural timber, soft textiles and a cosy dining corner create a homely atmosphere. One bedroom provides a double bed and a single bed for three concept guests, alongside a kitchen and bathroom. The terrace suits evening tea, while heating, Wi-Fi and parking complete the amenities. Indicative price: KGS 4,500 per night. Nomad House is a fictional demo cabin with illustrative photos; bookings and payments are disabled.",
    ],
    price: 4500, guests: 3, bedrooms: 1, beds: 2, bathrooms: 1,
    photos: ["demo-nomad-house.webp", "demo-interior-timber.webp", "kyrgyzstan-osh.webp"],
  },
  {
    slug: "demo-lake-paradise", region: "issyk-kul",
    title: ["Lake Paradise", "Lake Paradise", "Lake Paradise"],
    settlement: ["Бостери", "Бостери", "Bosteri"],
    description: [
      "Светлый A-Frame, вдохновлённый летним отдыхом на Иссык-Куле: большие окна, песочная палитра и просторная терраса для неспешных завтраков. Три спальни с двумя двуспальными и двумя односпальными кроватями рассчитаны на шесть гостей; две ванные удобны для семьи или друзей. Общая гостиная и кухня с обеденным столом располагают к долгим разговорам. Предусмотрены Wi-Fi, отопление и парковка. Примерная цена — 9 000 сом за ночь. Это вымышленный демо-объект с иллюстративными фото; бронирование, оплата и проживание недоступны.",
      "Ысык-Көлдөгү жайкы эс алуудан шыктанган жарык A-Frame: чоң терезелер, кум түстөрү жана жай эртең мененки тамак үчүн кең терраса. Үч уктоочу бөлмөдөгү эки кишилик эки жана бир кишилик эки керебет алты конокко эсептелген; эки жуунучу бөлмө үй-бүлөгө же досторго ыңгайлуу. Жалпы конок бөлмөсү жана тамактануучу үстөлү бар ашкана узак баарлашууга чакырат. Wi-Fi, жылытуу жана унаа токтотуучу жай каралган. Болжолдуу баасы — түнүнө 9 000 сом. Бул ойдон чыгарылган демо-объект; сүрөттөр иллюстрациялык, ээлөө, төлөм жана жашоо жеткиликсиз.",
      "A bright A-Frame inspired by summer days at Issyk-Kul, with large windows, a sandy palette and a broad terrace for unhurried breakfasts. Three bedrooms with two double beds and two single beds suit six concept guests; two bathrooms make sharing comfortable for family or friends. A communal lounge and kitchen with a dining table invite long conversations. Wi-Fi, heating and parking are included. Indicative price: KGS 9,000 per night. This fictional demo property uses illustrative photos; bookings, payments and real stays are unavailable.",
    ],
    price: 9000, guests: 6, bedrooms: 3, beds: 4, bathrooms: 2,
    photos: ["demo-lake-paradise.webp", "demo-interior-kitchen.webp", "kyrgyzstan-issyk-kul.webp"],
  },
];

export const demoCabins = collection.map((item, index) => {
  const plot = `DEMO-${String(index + 1).padStart(2, "0")}`;
  return {
    ...item,
    address: [
      `${item.settlement[0]}, условный участок ${plot} (вымышленный адрес)`,
      `${item.settlement[1]}, шарттуу тилке ${plot} (ойдон чыгарылган дарек)`,
      `${item.settlement[2]}, fictional plot ${plot} (not a real address)`,
    ] as Translation,
    amenities: ["wifi", "kitchen", "heating", "parking", "terrace"],
    checkInTime: "14:00", checkOutTime: "11:00",
  };
});
