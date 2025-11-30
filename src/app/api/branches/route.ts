import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const minimal = searchParams.get("minimal");

    if (minimal === "true") {
      const branches = await prisma.branches.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });

      return NextResponse.json(branches, { status: 200 });
    }
    const branches = await prisma.branches.findMany({
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json(branches, { status: 200 });
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
