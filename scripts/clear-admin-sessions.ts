import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

async function clearAdminSessions() {
  const connection = new URL(process.env.DATABASE_URL!);
  if (connection.searchParams.get("sslmode") === "require")
    connection.searchParams.set("sslmode", "verify-full");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });

  try {
    console.log("🧹 Очищаем сессии и вызовы входа...\n");

    // Удаляем все сессии
    const deletedSessions = await db.session.deleteMany({});
    console.log(`✅ Удалено сессий: ${deletedSessions.count}`);

    // Удаляем все вызовы админского входа
    const deletedChallenges = await db.adminLoginChallenge.deleteMany({});
    console.log(`✅ Удалено вызовов входа: ${deletedChallenges.count}`);

    console.log("\n✨ Готово! Теперь можете войти заново:");
    console.log("   http://localhost:3001/ru/admin-login");

  } catch (error) {
    console.error("❌ Ошибка:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

clearAdminSessions();
