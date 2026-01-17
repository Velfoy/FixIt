import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notification_type, Prisma } from "@prisma/client";

const VALID_TYPES: notification_type[] = [
  "REPAIR_COMPLETED",
  "INSPECTION_SOON",
  "PROMOTION",
  "MESSAGE",
];

function parseLimit(searchParams: URLSearchParams) {
  const raw = searchParams.get("limit");
  if (!raw) return 50;
  const n = Number(raw);
  if (Number.isNaN(n) || n < 1) return 50;
  return Math.min(n, 200);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id) || null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const typeParam = searchParams.get("type") as notification_type | null;
  const unread = searchParams.get("unread") === "true";
  const limit = parseLimit(searchParams);

  const where: Prisma.notificationWhereInput = { user_id: userId };
  if (unread) where.read = false;
  if (typeParam && VALID_TYPES.includes(typeParam)) {
    where.type = typeParam;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      read: true,
      created_at: true,
    },
  });

  return NextResponse.json(notifications);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id) || null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const ids: number[] = Array.isArray(body?.ids) ? body.ids : [];
  const read = Boolean(body?.read);

  if (!ids.length) {
    return NextResponse.json(
      { error: "No notification ids provided" },
      { status: 400 },
    );
  }

  const result = await prisma.notification.updateMany({
    where: { id: { in: ids }, user_id: userId },
    data: { read },
  });

  return NextResponse.json({ updated: result.count });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id) || null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const ids: number[] = Array.isArray(body?.ids) ? body.ids : [];

  if (!ids.length) {
    return NextResponse.json(
      { error: "No notification ids provided" },
      { status: 400 },
    );
  }

  const result = await prisma.notification.deleteMany({
    where: { id: { in: ids }, user_id: userId },
  });

  return NextResponse.json({ deleted: result.count });
}
