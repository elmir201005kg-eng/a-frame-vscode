import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

async function testAdminAccess() {
  const connection = new URL(process.env.DATABASE_URL!);
  if (connection.searchParams.get("sslmode") === "require")
    connection.searchParams.set("sslmode", "verify-full");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });

  try {
    console.log("🔍 Проверяем администраторов...\n");

    // Находим всех администраторов
    const admins = await db.user.findMany({
      where: {
        role: { in: ["ADMIN", "SUPER_ADMIN"] },
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        isActive: true,
        passwordHash: true,
        _count: {
          select: { sessions: true }
        }
      }
    });

    if (admins.length === 0) {
      console.log("❌ Администраторы не найдены!");
      console.log("Запустите: npm run db:create-admin");
      return;
    }

    console.log(`✅ Найдено администраторов: ${admins.length}\n`);

    for (const admin of admins) {
      console.log(`👤 ${admin.firstName} (${admin.email})`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive ? "✅" : "❌"}`);
      console.log(`   Has Password: ${admin.passwordHash ? "✅" : "❌"}`);
      console.log(`   Sessions: ${admin._count.sessions}`);
      console.log("");
    }

    // Проверяем переменные окружения
    console.log("🔧 Проверка переменных окружения:");
    console.log(`   ADMIN_EMAIL: ${process.env.ADMIN_EMAIL ? "✅" : "❌"}`);
    console.log(`   ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? "✅" : "❌"}`);
    console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? "✅" : "❌"}`);
    console.log(`   TELEGRAM_ADMIN_CHAT_ID: ${process.env.TELEGRAM_ADMIN_CHAT_ID ? "✅" : "❌"}`);
    console.log(`   ADMIN_OTP_SECRET: ${process.env.ADMIN_OTP_SECRET ? "✅" : "❌"}`);

    console.log("\n📋 Итог:");
    console.log("   Страница входа: http://localhost:3001/admin-login");
    console.log("   Или: http://localhost:3001/ru/admin-login");
    console.log(`\n   Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD ? "***" : "НЕ УСТАНОВЛЕН"}`);

  } catch (error) {
    console.error("❌ Ошибка:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

testAdminAccess();
