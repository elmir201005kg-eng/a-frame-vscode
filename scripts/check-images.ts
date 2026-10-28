import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

async function checkImages() {
  const connection = new URL(process.env.DATABASE_URL!);
  if (connection.searchParams.get("sslmode") === "require")
    connection.searchParams.set("sslmode", "verify-full");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });

  try {
    console.log("🖼️  Проверяем изображения домиков...\n");

    // Получаем домики с изображениями
    const cabins = await db.cabin.findMany({
      take: 10,
      include: {
        images: {
          take: 3,
          orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }]
        }
      }
    });

    console.log(`📊 Всего домиков в выборке: ${cabins.length}\n`);

    for (const cabin of cabins) {
      console.log(`🏡 ${cabin.title || cabin.titleEn || cabin.titleKg} (#${cabin.id})`);
      console.log(`   Изображений: ${cabin.images.length}`);
      
      if (cabin.images.length > 0) {
        cabin.images.forEach((img, index) => {
          const path = img.imageUrl;
          const isExternal = path.startsWith("http://") || path.startsWith("https://");
          const isRelative = path.startsWith("/");
          console.log(`   ${index + 1}. ${isExternal ? "🌐 External" : isRelative ? "📁 Local" : "❓ Unknown"}: ${path.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ Нет изображений!`);
      }
      console.log("");
    }

    // Статистика
    const totalImages = await db.cabinImage.count();
    const externalImages = await db.cabinImage.count({
      where: {
        OR: [
          { imageUrl: { startsWith: "http://" } },
          { imageUrl: { startsWith: "https://" } }
        ]
      }
    });
    const localImages = totalImages - externalImages;

    console.log("📊 Общая статистика:");
    console.log(`   Всего изображений: ${totalImages}`);
    console.log(`   🌐 Внешние URL: ${externalImages}`);
    console.log(`   📁 Локальные: ${localImages}`);

    console.log("\n🔧 Настройки:");
    console.log(`   UPLOAD_DIR: ${process.env.UPLOAD_DIR || "НЕ УСТАНОВЛЕН"}`);

  } catch (error) {
    console.error("❌ Ошибка:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

checkImages();
