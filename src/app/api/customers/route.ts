import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Customer } from "@/types/customer";

// GET /api/customers
export async function GET() {
  try {
    const usersWithCustomers = await prisma.users.findMany({
      include: {
        customer: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    const usersWithCustomerProfiles = usersWithCustomers.filter(
      (u) => u.customer !== null
    );

    const customers: Customer[] = await Promise.all(
      usersWithCustomerProfiles.map(async (u) => {
        const cust = u.customer!;

        const orderStats = await prisma.service_order.aggregate({
          where: { customer_id: cust.id },
          _count: true,
          _sum: { total_cost: true },
        });

        const totalOrders = orderStats._count || 0;
        const totalSpent = Number(orderStats._sum.total_cost || 0);

        return {
          id: cust.id,
          name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
          email: u.email,
          phone: u.phone ?? "",
          address: cust.address ?? "",
          city: cust.city ?? "",
          postal_code: cust.postal_code ?? "",
          nip: cust.nip ?? "",
          cars: cust.vehicle.map((v) => ({
            model: v.model,
            year: v.year ?? 0,
            plate: v.license_plate ?? "",
          })),
          totalOrders,
          totalSpent,
          lastVisit:
            cust.updated_at?.toISOString().slice(0, 10) ??
            new Date().toISOString().slice(0, 10),
          memberSince: u.created_at.toISOString().slice(0, 10),
        };
      })
    );

    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST /api/customers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, address, city, postal_code, nip } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { user_id },
    });
    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer for this user already exists" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: { user_id, address, city, postal_code, nip },
    });

    const customerWithRelations = await prisma.customer.findUnique({
      where: { id: customer.id },
      include: { users: true, vehicle: true },
    });

    return NextResponse.json({
      id: customer.id,
      name: `${customerWithRelations?.users?.first_name ?? ""} ${
        customerWithRelations?.users?.last_name ?? ""
      }`.trim(),
      email: customerWithRelations?.users?.email ?? "",
      phone: customerWithRelations?.users?.phone ?? "",
      address: customerWithRelations?.address ?? "",
      city: customerWithRelations?.city ?? "",
      postal_code: customerWithRelations?.postal_code ?? "",
      nip: customerWithRelations?.nip ?? "",
      cars:
        customerWithRelations?.vehicle?.map((v) => ({
          model: v.model,
          year: v.year ?? 0,
          plate: v.license_plate ?? "",
        })) ?? [],
      totalOrders: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      memberSince:
        customerWithRelations?.users?.created_at?.toISOString().slice(0, 10) ??
        new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
// PUT /api/customers - Update customer
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, address, city, postal_code, nip } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing customer id" },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: { users: true },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        address: address || "",
        city: city || "",
        postal_code: postal_code || "",
        nip: nip || "",
      },
      include: {
        users: true,
        vehicle: true,
        service_order: true,
      },
    });

    const totalOrders = updatedCustomer.service_order.length;
    const totalSpent = updatedCustomer.service_order.reduce((sum, order) => {
      return sum + Number(order.total_cost || 0);
    }, 0);

    return NextResponse.json({
      id: updatedCustomer.id,
      name: `${updatedCustomer.users?.first_name ?? ""} ${
        updatedCustomer.users?.last_name ?? ""
      }`.trim(),
      email: updatedCustomer.users?.email ?? "",
      phone: updatedCustomer.users?.phone ?? "",
      address: updatedCustomer.address ?? "",
      city: updatedCustomer.city ?? "",
      postal_code: updatedCustomer.postal_code ?? "",
      nip: updatedCustomer.nip ?? "",
      cars: updatedCustomer.vehicle.map((v) => ({
        model: v.model,
        year: v.year ?? 0,
        plate: v.license_plate ?? "",
      })),
      totalOrders,
      totalSpent,
      lastVisit:
        updatedCustomer.updated_at?.toISOString().slice(0, 10) ??
        new Date().toISOString().slice(0, 10),
      memberSince:
        updatedCustomer.users?.created_at?.toISOString().slice(0, 10) ??
        new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("PUT /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}
