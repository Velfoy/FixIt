import prisma from "@/lib/prisma";
import {
  PriorityOrder,
  ServiceOrders,
  StatusServiceOrder,
} from "@/types/serviceorders";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const orders = await prisma.service_order.findMany({
      include: {
        vehicle: true,
        employees: { include: { users: true } },
      },
      orderBy: { updated_at: "desc" },
    });
    const ordersGet: ServiceOrders[] = orders.map((o) => {
      return {
        id: o.id,
        orderNumber: o.order_number,
        carBrand: o.vehicle?.brand || "",
        carModel: o.vehicle?.model || "",
        carYear: o.vehicle?.year?.toString() || "",
        issue: o.issue || "",
        description: o.description || "",
        status: o.status as StatusServiceOrder,
        startDate: o.start_date?.toISOString() || "",
        endDate: o.end_date?.toISOString() || "",
        total_cost: Number(o.total_cost) || 0,
        created_at: o.created_at.toISOString(),
        updated_at: o.updated_at.toISOString(),
        progress: Number(o.progress) || 0,
        priority: o.priority as PriorityOrder,
        mechanicFirstName: o?.employees?.users.first_name || "",
        mechanicLastName: o?.employees?.users.last_name || "",
      };
    });
    return NextResponse.json(ordersGet, { status: 202 });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
