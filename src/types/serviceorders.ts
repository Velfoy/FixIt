type ServiceOrders = {
  id: string;
  orderNumber: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  issue: string;
  description: string;
  status: StatusServiceOrder;
  startDate: string;
  endDate: string;
  total_cost: number;
  created_at: string;
  updated_at: string;
  progress: number;
  priority: string;
  mechanicFirstName: string;
  mechanicLastName: string;
};
export type PriorityOrder = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type StatusServiceOrder =
  | "NEW"
  | "IN_PROGRESS"
  | "WAITING_FOR_PARTS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type { ServiceOrders };
