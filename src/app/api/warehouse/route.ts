import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Part } from "@/types/part";
export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { updated_at: "desc" },
    });
    return NextResponse.json(parts);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, part_number, quantity, min_quantity, price, supplier } = body;
    if (!name || !part_number || !quantity || !min_quantity || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const existing = await prisma.part.findUnique({
      where: { part_number },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Part with such part number already exists" },
        { status: 400 }
      );
    }
    const data: any = {
      name,
      part_number,
      quantity,
      min_quantity,
      price,
      supplier,
    };
    const createNewPart = await prisma.part.create({
      data: data,
    });
    return NextResponse.json(createNewPart, { status: 201 });
  } catch (error) {
    console.error("POST /api/warehouse error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, part_number, quantity, min_quantity, price, supplier } =
      body;

    const partId = Number(id);

    if (!partId || Number.isNaN(partId)) {
      return NextResponse.json({ error: "Invalid part ID" }, { status: 400 });
    }

    const updatedPart = await prisma.part
      .update({
        where: { id: partId },
        data: {
          name,
          part_number,
          quantity,
          min_quantity,
          price,
          supplier,
        },
      })
      .catch((err) => {
        console.error("Prisma update error", err);
        return null;
      });

    if (!updatedPart) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPart, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/warehouse error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    const partId = Number(id);

    if (!partId || Number.isNaN(partId)) {
      return NextResponse.json({ error: "Invalid part ID" }, { status: 400 });
    }
    const deletedUser = await prisma.part
      .delete({ where: { id: partId } })
      .catch((err) => {
        console.error("Prisma delete error", err);
        return null;
      });
    if (!deletedUser) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/warehouse error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
