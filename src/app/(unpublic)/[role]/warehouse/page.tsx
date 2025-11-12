import React from "react";
import { authorizeRoute } from "@/lib/authorize";

export default async function Warehouse() {
  await authorizeRoute("warehouse");

  return <div>Warehouse</div>;
}
