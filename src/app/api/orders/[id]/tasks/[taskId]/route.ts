import prisma from "@/lib/prisma";
import { order_status } from "@/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";
import { PriorityOrder } from "@/types/serviceorders";

async function computeOrderProgress(orderId: number): Promise<number> {
  const tasks = await prisma.service_task.findMany({
    where: { service_order_id: orderId },
    select: { status: true },
  });
  if (tasks.length === 0) return 0;
  const completedCount = tasks.filter(
    (t) => t.status === "COMPLETED" || t.status === "READY"
  ).length;
  return Math.round((completedCount / tasks.length) * 100);
}

export async function PUT(req: NextRequest, context: any) {
  try {
    const params = await context.params;
    const orderId = Number(params?.id);
    const taskId = Number(params?.taskId);
    if (!Number.isFinite(orderId) || !Number.isFinite(taskId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, mechanicId } = body;
    let { priority, status } = body as any;

    const PRIORITY_MAP: Record<number | string, string> = {
      1: "LOW",
      2: "NORMAL",
      3: "HIGH",
      4: "URGENT",
      LOW: "LOW",
      NORMAL: "NORMAL",
      HIGH: "HIGH",
      URGENT: "URGENT",
    };

    const TASK_TO_ORDER: Record<string, string> = {
      PENDING: "NEW",
      IN_PROGRESS: "IN_PROGRESS",
      DONE: "COMPLETED",
      BLOCKED: "WAITING_FOR_PARTS",
      NEW: "NEW",
    };

    const ORDER_STATUSES = new Set([
      "NEW",
      "IN_PROGRESS",
      "WAITING_FOR_PARTS",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ]);

    let finalPriority: string;
    if (typeof priority === "number") {
      finalPriority = PRIORITY_MAP[priority] || "LOW";
    } else if (typeof priority === "string") {
      finalPriority =
        PRIORITY_MAP[priority.toUpperCase() as any] || priority.toUpperCase();
    } else {
      finalPriority = "LOW";
    }

    let finalStatus: string;
    if (!status) finalStatus = "NEW";
    else if (typeof status === "string") {
      const up = status.toUpperCase();
      finalStatus = TASK_TO_ORDER[up] || up;
    } else finalStatus = "NEW";

    if (!ORDER_STATUSES.has(finalStatus)) finalStatus = "NEW";

    const normalizedStatus =
      (order_status as any)[finalStatus] || order_status.NEW;

    const existing = await prisma.service_task.findUnique({
      where: { id: taskId },
    });
    if (!existing || existing.service_order_id !== orderId) {
      return NextResponse.json(
        { error: "Task not found for this order" },
        { status: 404 }
      );
    }

    const updated = await prisma.service_task.update({
      where: { id: taskId },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        mechanic_id:
          mechanicId !== undefined
            ? mechanicId
              ? Number(mechanicId)
              : null
            : existing.mechanic_id,
        priority: finalPriority as PriorityOrder,
        status: normalizedStatus,
      },
      include: { employees: { include: { users: true } } },
    });

    const newProgress = await computeOrderProgress(orderId);
    await prisma.service_order.update({
      where: { id: orderId },
      data: { progress: newProgress },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: String(e) }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    const params = await context.params;
    const orderId = Number(params?.id);
    const taskId = Number(params?.taskId);
    if (!Number.isFinite(orderId) || !Number.isFinite(taskId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.service_task.findUnique({
      where: { id: taskId },
    });
    if (!existing || existing.service_order_id !== orderId) {
      return NextResponse.json(
        { error: "Task not found for this order" },
        { status: 404 }
      );
    }

    await prisma.service_task.delete({ where: { id: taskId } });

    const newProgress = await computeOrderProgress(orderId);
    await prisma.service_order.update({
      where: { id: orderId },
      data: { progress: newProgress },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: String(e) }), {
      status: 500,
    });
  }
}
