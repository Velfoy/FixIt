import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { id, terminated_at } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing mechanic ID" },
        { status: 400 }
      );
    }

    const updated = await prisma.employees.update({
      where: { id },
      data: {
        is_active: false,
        terminated_at,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to terminate mechanic" },
      { status: 500 }
    );
  }
}
