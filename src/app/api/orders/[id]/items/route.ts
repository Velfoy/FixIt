import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET all items for an order
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const items = await prisma.service_order_item.findMany({
      where: { service_order_id: orderId },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
// POST - add new item WITHOUT updating total_cost
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, type, cost } = body;

    // Validate input
    if (!name || !type || cost === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, cost" },
        { status: 400 }
      );
    }

    if (cost <= 0) {
      return NextResponse.json(
        { error: "Cost must be greater than 0" },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await prisma.service_order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create item ONLY - don't update total_cost
    const item = await prisma.service_order_item.create({
      data: {
        service_order_id: orderId,
        name,
        type,
        cost: parseFloat(cost.toString()),
        status: "pending",
      },
    });

    // Return just the item, NOT the updated order
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
