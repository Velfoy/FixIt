import React from "react";
import { authorizePage } from "@/lib/authorize";
import CarsView from "@/components/pages/CarsView";
import type { Car } from "@/types/car";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const Cars = async () => {
  const session = await authorizePage(["admin", "client"]);

  try {
    // Fetch cars
    const carsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/cars`, {
      cache: "no-store",
    });
    const cars: Car[] = carsRes.ok ? await carsRes.json() : [];

    // Fetch branches
    const branchesRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/branches?minimal=true`,
      { cache: "no-store" }
    );
    const branches = branchesRes.ok ? await branchesRes.json() : [];

    // Fetch customers
    const customersRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/customers?minimal=true`,
      { cache: "no-store" }
    );
    const customers: Customer[] = customersRes.ok
      ? await customersRes.json()
      : [];

    return (
      <CarsView
        dataCars={cars}
        session={session}
        branches={branches}
        customers={customers} // pass customers prop
      />
    );
  } catch (error) {
    console.error(error);
    return (
      <CarsView dataCars={[]} session={session} branches={[]} customers={[]} />
    );
  }
};

export default Cars;
