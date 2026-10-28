import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

async function enableDemoCabins() {
  const connection = new URL(process.env.DATABASE_URL!);
  if (connection.searchParams.get("sslmode") === "require")
    connection.searchParams.set("sslmode", "verify-full");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });
  console.log("🔄 Обновляем демо-домики...");

  try {
    // Находим все домики с isDemo = true
    const demoCabins = await db.cabin.findMany({
      where: { isDemo: true },
      select: { id: true, title: true, titleKg: true, titleEn: true }
    });

    if (demoCabins.length === 0) {
      console.log("⚠️  Демо-домики не найдены");
      return;
    }

    console.log(`\n📋 Найдено ${demoCabins.length} демо-домиков:`);
    demoCabins.forEach(cabin => {
      console.log(`  - #${cabin.id}: ${cabin.title || cabin.titleEn || cabin.titleKg}`);
    });

    // Обновляем демо-домики:
    // 1. Делаем их обычными (isDemo = false)
    // 2. Включаем возможность бронирования (isBookable = true)
    // 3. Публикуем их (status = PUBLISHED)
    const result = await db.cabin.updateMany({
      where: { isDemo: true },
      data: {
        isDemo: false,
        isBookable: true,
        status: "PUBLISHED"
      }
    });

    console.log(`\n✅ Успешно обновлено ${result.count} домиков`);
    console.log("\n📝 Изменения:");
    console.log("  - isDemo: true → false (теперь полноценные домики)");
    console.log("  - isBookable: true (можно бронировать)");
    console.log("  - status: PUBLISHED (опубликованы)");
    console.log("\n💳 Теперь для этих домиков доступна оплата через Finik Pay");

  } catch (error) {
    console.error("❌ Ошибка при обновлении:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

enableDemoCabins();
