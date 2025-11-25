import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET /api/customers
export async function GET() {
  try {
  } catch (error) {
    console.log("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
  } catch (error) {
    console.log("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
