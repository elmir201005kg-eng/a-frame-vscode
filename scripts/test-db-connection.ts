import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

async function testConnection() {
  const connection = new URL(process.env.DATABASE_URL!);
  if (connection.searchParams.get("sslmode") === "require")
    connection.searchParams.set("sslmode", "verify-full");
  
  console.log("🔍 Тестирование подключения к базе данных...\n");
  console.log(`Host: ${connection.hostname}`);
  console.log(`Database: ${connection.pathname.slice(1)}\n`);

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });

  try {
    const start = Date.now();
    
    // Простой запрос
    const result = await db.$queryRaw`SELECT 1 as test`;
    const simpleTime = Date.now() - start;
    console.log(`✅ Простой запрос: ${simpleTime}ms`);

    // Подсчет пользователей
    const userStart = Date.now();
    const userCount = await db.user.count();
    const userTime = Date.now() - userStart;
    console.log(`✅ Пользователи: ${userCount} (${userTime}ms)`);

    // Подсчет домиков
    const cabinStart = Date.now();
    const cabinCount = await db.cabin.count();
    const cabinTime = Date.now() - cabinStart;
    console.log(`✅ Домики: ${cabinCount} (${cabinTime}ms)`);

    // Подсчет бронирований
    const bookingStart = Date.now();
    const bookingCount = await db.booking.count();
    const bookingTime = Date.now() - bookingStart;
    console.log(`✅ Бронирования: ${bookingCount} (${bookingTime}ms)`);

    console.log("\n📊 Итог:");
    const total = simpleTime + userTime + cabinTime + bookingTime;
    console.log(`   Общее время: ${total}ms`);
    
    if (total > 5000) {
      console.log("   ⚠️  МЕДЛЕННОЕ ПОДКЛЮЧЕНИЕ (>5сек)");
      console.log("   Причины: высокая задержка сети или медленная БД");
    } else if (total > 2000) {
      console.log("   ⚠️  Умеренная скорость (2-5сек)");
    } else {
      console.log("   ✅ Отличная скорость (<2сек)");
    }

  } catch (error) {
    console.error("\n❌ Ошибка подключения:");
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

testConnection();
