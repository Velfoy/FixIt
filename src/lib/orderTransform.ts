import { Order } from "@/types/serviceorders";

export const transformOrder = (apiOrder: any, currentOrder?: Order | null): Order => {
  return {
    id: apiOrder.id,
    orderNumber: apiOrder.order_number,
    carBrand: apiOrder.vehicle?.brand || currentOrder?.carBrand || "",
    carModel: apiOrder.vehicle?.model || currentOrder?.carModel || "",
    carYear: apiOrder.vehicle?.year?.toString() || currentOrder?.carYear || "",
    carLicensePlate:
      apiOrder.vehicle?.license_plate || currentOrder?.carLicensePlate || "",
    issue: apiOrder.issue || "",
    description: apiOrder.description || "",
    status: apiOrder.status,
    endDate: apiOrder.end_date || "",
    total_cost: parseFloat(apiOrder.total_cost?.toString() || "0"),
    progress: parseFloat(apiOrder.progress?.toString() || "0"),
    priority: apiOrder.priority || "NORMAL",
    mechanicFirstName:
      apiOrder.employees?.users?.first_name ||
      currentOrder?.mechanicFirstName ||
      "",
    mechanicLastName:
      apiOrder.employees?.users?.last_name ||
      currentOrder?.mechanicLastName ||
      "",
    mechanicEmail:
      apiOrder.employees?.users?.email || currentOrder?.mechanicEmail || "",
    mechanicPhone:
      apiOrder.employees?.users?.phone || currentOrder?.mechanicPhone || "",
    task:
      apiOrder.service_task?.map((t: any) => ({
        id: t.id,
        mechanicFirstName: t.employees?.users?.first_name || "",
        mechanicLastName: t.employees?.users?.last_name || "",
        title: t.title,
        description: t.description,
        status: t.status,
        created_at: t.created_at,
        updated_at: t.updated_at,
        priority: t.priority,
      })) ||
      currentOrder?.task ||
      [],
  };
};

export const toNumber = (val: any): number => {
  if (val === null || val === undefined) return 0;
  return parseFloat(val.toString());
};
