import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Проверяем подключение к базе
    const usersCount = await db.users.count();
    const ordersCount = await db.service_order.count();

    // Получаем список всех таблиц
    const tables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    return NextResponse.json({
      success: true,
      message: "✅ База данных подключена!",
      stats: {
        users: usersCount,
        orders: ordersCount,
      },
      tables: tables,
    });
  } catch (error: any) {
    console.error("Ошибка подключения к базе:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось подключиться к базе данных",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
