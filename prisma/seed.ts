import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connection = new URL(process.env.DATABASE_URL!);
if (connection.searchParams.get("sslmode") === "require")
  connection.searchParams.set("sslmode", "verify-full");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: connection.toString() }) });
const regions = [
  ["issyk-kul", "Иссык-Куль", "Ысык-Көл", "Issyk-Kul"],
  ["chon-kemin", "Чон-Кемин", "Чоң-Кемин", "Chon-Kemin"],
  ["karakol", "Каракол", "Каракол", "Karakol"],
  ["naryn", "Нарын", "Нарын", "Naryn"],
  ["ala-archa", "Ала-Арча", "Ала-Арча", "Ala-Archa"],
  ["osh", "Ош", "Ош", "Osh"],
];
const amenities = [
  ["wifi", "Wi-Fi", "Wi-Fi", "Wi-Fi"],
  ["kitchen", "Кухня", "Ашкана", "Kitchen"],
  ["parking", "Парковка", "Унаа токтотуучу жай", "Parking"],
  ["heating", "Отопление", "Жылытуу", "Heating"],
  ["terrace", "Терраса", "Терраса", "Terrace"],
];
async function main() {
  for (const [slug, name, nameKg, nameEn] of regions) {
    if (!(await db.region.findFirst({ where: { OR: [{ slug }, { name }] } })))
      await db.region.create({ data: { slug, name, nameKg, nameEn } });
  }
  for (const [slug, name, nameKg, nameEn] of amenities) {
    if (!(await db.amenity.findFirst({ where: { OR: [{ slug }, { name }] } })))
      await db.amenity.create({ data: { slug, name, nameKg, nameEn } });
  }
  console.log(
    "Region and amenity reference data is ready. No users, cabins, bookings or payments were seeded.",
  );
}
main()
  .catch(() => {
    console.error("Reference data could not be created.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
