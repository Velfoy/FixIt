import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getCachedSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let roleSpecificData = null;

    // Fetch customer-specific data
    if (user.role === "CLIENT") {
      const customer = await prisma.customer.findUnique({
        where: { user_id: userId },
        select: {
          address: true,
          city: true,
          postal_code: true,
          nip: true,
        },
      });
      roleSpecificData = customer;
    }

    // Fetch employee/mechanic-specific data
    if (user.role === "MECHANIC") {
      const employee = await prisma.employees.findUnique({
        where: { user_id: userId },
        select: {
          position: true,
          specialization: true,
          hired_at: true,
          employment_type: true,
          branch_id: true,
          branches: {
            select: {
              name: true,
            },
          },
        },
      });
      roleSpecificData = employee;
    }

    return NextResponse.json({ user, roleSpecificData });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCachedSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await req.json();
    const { firstName, lastName, phone, email, roleSpecificData } = body;

    // Validate input
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it already exists
    const currentUser = await prisma.users.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (currentUser && email !== currentUser.email) {
      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with such email already exists, please enter another one" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        role: true,
      },
    });

    let updatedRoleData = null;

    // Update customer-specific data
    if (updatedUser.role === "CLIENT" && roleSpecificData) {
      const customer = await prisma.customer.findUnique({
        where: { user_id: userId },
      });

      if (customer) {
        updatedRoleData = await prisma.customer.update({
          where: { user_id: userId },
          data: {
            address: roleSpecificData.address || null,
            city: roleSpecificData.city || null,
            postal_code: roleSpecificData.postal_code || null,
            nip: roleSpecificData.nip || null,
          },
        });
      }
    }

    // Update employee/mechanic-specific data
    if (updatedUser.role === "MECHANIC" && roleSpecificData) {
      const employee = await prisma.employees.findUnique({
        where: { user_id: userId },
      });

      if (employee) {
        updatedRoleData = await prisma.employees.update({
          where: { user_id: userId },
          data: {
            specialization: roleSpecificData.specialization || null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      roleSpecificData: updatedRoleData,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
