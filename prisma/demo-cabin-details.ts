export type Translation = [ru: string, kg: string, en: string];
export const demoAmenities = ["wifi", "kitchen", "heating", "parking", "terrace"];
export const demoRegions = [
  ["issyk-kul", "Иссык-Куль", "Ысык-Көл", "Issyk-Kul"],
  ["karakol", "Каракол", "Каракол", "Karakol"],
  ["naryn", "Нарын", "Нарын", "Naryn"],
  ["osh", "Ош", "Ош", "Osh"],
  ["chui", "Чуйская область", "Чүй облусу", "Chuy Region"],
];
export const demoAmenityNames = [
  ["wifi", "Wi-Fi", "Wi-Fi", "Wi-Fi"],
  ["kitchen", "Кухня", "Ашкана", "Kitchen"],
  ["heating", "Отопление", "Жылытуу", "Heating"],
  ["parking", "Парковка", "Унаа токтотуучу жай", "Parking"],
  ["terrace", "Терраса", "Терраса", "Terrace"],
];
export const demoRules: { title: Translation; description: Translation }[] = [
  { title: ["Только демонстрация", "Көрсөтмө үчүн гана", "Demonstration only"], description: [
    "Домик вымышленный. Бронирование, оплата и проживание недоступны; адрес условный, фотографии иллюстративные.",
    "Үй ойдон чыгарылган. Ээлөө, төлөм жана жашоо жеткиликтүү эмес; дарек шарттуу, сүрөттөр мисал катары берилген.",
    "This cabin is fictional. Booking, payment and stays are unavailable; the address is fictional and photos are illustrative.",
  ] },
  { title: ["Тихие часы", "Тынчтык убактысы", "Quiet hours"], description: [
    "Пример правил: соблюдайте тишину с 22:00 до 08:00 и берегите покой соседей.",
    "Эрежелердин мисалы: 22:00дөн 08:00гө чейин тынчтыкты сактап, кошуналарды урматтаңыз.",
    "Example rule: keep noise down from 22:00 to 08:00 and respect neighbours.",
  ] },
  { title: ["Без курения и вечеринок", "Тамекисиз жана кечелерсиз", "No smoking or parties"], description: [
    "Пример правил: курение в помещении и вечеринки запрещены. Открытый огонь на террасе не допускается.",
    "Эрежелердин мисалы: үйдө тамеки чегүүгө жана кече өткөрүүгө болбойт. Террасада ачык от жагууга тыюу салынат.",
    "Example rule: no indoor smoking or parties. Open flames are not allowed on the terrace.",
  ] },
  { title: ["Гости и животные", "Коноктор жана жаныбарлар", "Guests and pets"], description: [
    "Пример правил: не превышайте указанное число гостей. Размещение с животными не предусмотрено.",
    "Эрежелердин мисалы: көрсөтүлгөн коноктордун санынан ашпаңыз. Үй жаныбарларын алып келүү каралган эмес.",
    "Example rule: do not exceed the stated capacity. Pets are not accommodated.",
  ] },
  { title: ["Бережное отношение", "Аяр мамиле", "Care for the space"], description: [
    "Пример правил: берегите мебель и природу, убирайте мусор. Заезд с 14:00, выезд до 11:00.",
    "Эрежелердин мисалы: эмеректерге жана жаратылышка аяр мамиле жасап, таштандыларды чогултуңуз. Кирүү 14:00дөн, чыгуу 11:00гө чейин.",
    "Example rule: care for the furniture and nature, and collect your litter. Check-in from 14:00, check-out by 11:00.",
  ] },
];

