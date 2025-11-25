type CustomerStatus = "active" | "vip" | "inactive";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  cars: { model: string; year: number; plate: string }[];
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  memberSince: string;
  status: CustomerStatus;
};
export type { Customer, CustomerStatus };
