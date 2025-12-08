import prisma from "@/lib/prisma";
import { order_status } from "@/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  try {
    const params = await context.params;
    const orderId = Number(params?.id);
    if (!Number.isFinite(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, mechanicId } = body;
    let { priority, status } = body as any;

    if (!title)
      return NextResponse.json({ error: "Missing title" }, { status: 400 });

    // Accept either numeric or string priorities. Normalize to DB enum values.
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

    // Map task-level statuses to order_status enum values.
    const TASK_TO_ORDER: Record<string, string> = {
      PENDING: "NEW",
      IN_PROGRESS: "IN_PROGRESS",
      DONE: "COMPLETED",
      BLOCKED: "WAITING_FOR_PARTS",
      NEW: "NEW",
    };

    // Allowed order_status values
    const ORDER_STATUSES = new Set([
      "NEW",
      "IN_PROGRESS",
      "WAITING_FOR_PARTS",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ]);

    // Normalize incoming priority
    let finalPriority: string;
    if (typeof priority === "number") {
      finalPriority = PRIORITY_MAP[priority] || "LOW";
    } else if (typeof priority === "string") {
      finalPriority =
        PRIORITY_MAP[priority.toUpperCase() as any] || priority.toUpperCase();
    } else {
      finalPriority = "LOW";
    }

    // Normalize incoming status (could be task_status or already order_status)
    let finalStatus: string;
    if (!status) {
      finalStatus = "NEW";
    } else if (typeof status === "string") {
      const up = status.toUpperCase();
      finalStatus = TASK_TO_ORDER[up] || up;
    } else {
      finalStatus = "NEW";
    }

    if (!ORDER_STATUSES.has(finalStatus)) {
      console.warn(
        `Unknown mapped status '${finalStatus}', falling back to NEW`
      );
      finalStatus = "NEW";
    }

    // Normalize to the generated Prisma enum constants to avoid any mismatch
    const normalizedPriority = finalPriority;
    const normalizedStatus =
      (order_status as any)[finalStatus] || order_status.NEW;
    const payload = {
      title,
      description,
      service_order_id: Number(orderId),
      mechanic_id: mechanicId ? Number(mechanicId) : undefined,
      priority: normalizedPriority,
      status: normalizedStatus,
    } as const;

    console.log(
      `Creating task for order ${orderId} - incoming status: ${String(
        status
      )}, mapped status: ${finalStatus}, priority: ${finalPriority}`
    );
    console.log("Prisma payload:", JSON.stringify(payload));

    const created = await prisma.service_task.create({
      data: payload as any,
      include: { employees: { include: { users: true } } },
    });

    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: String(e) }), {
      status: 500,
    });
  }
}
