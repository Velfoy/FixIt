import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}
// DELETE endpoint - only delete item, don't update total_cost
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params;
    const orderId = parseInt(id);
    const itemIdNum = parseInt(itemId);

    if (isNaN(orderId) || isNaN(itemIdNum)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    // Check if item exists
    const item = await prisma.service_order_item.findUnique({
      where: { id: itemIdNum, service_order_id: orderId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete the item
    await prisma.service_order_item.delete({
      where: { id: itemIdNum },
    });

    // Return success - no order update
    return NextResponse.json({
      success: true,
      deletedItemId: itemIdNum,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
