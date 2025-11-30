import React from "react";
import { authorizePage } from "@/lib/authorize";
import WarehouseView from "@/components/pages/WarehouseView";
import type { Part } from "@/types/part";

export default async function Warehouse() {
  const session = await authorizePage(["warehouse", "mechanic", "admin"]);
  try {
    const res = await fetch("http://localhost:3000/api/warehouse", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
      cache: "no-cache",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch customers: ${res.status}`);
    }
    const dataWarehouse: Part[] = await res.json();
    return (
      <WarehouseView
        dataWarehouse={dataWarehouse}
        session={session}
      ></WarehouseView>
    );
  } catch (error) {
    console.error("Error in CustomersPage:", error);
    return <WarehouseView dataWarehouse={[]} session={session} />;
  }
}
