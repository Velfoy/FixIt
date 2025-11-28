type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city?: string;
  postal_code?: string;
  nip?: string;
  address: string;
  cars: { model: string; year: number; plate: string }[];
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  memberSince: string;
};
export type { Customer };
