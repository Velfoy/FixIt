import { DateTime } from "next-auth/providers/kakao";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN";
type Mechanic = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  salary: number;
  employment_type: EmploymentType;
  is_Active: boolean;
  specialization: string;
  position: string;
  branchId: number;
  branchName: string;
  hired_at: Date;
  terminated_at: DateTime;
  createdAt: string;
  updatedAt: string;
  totalOrders?: { [status: string]: number };
  totalRevenue?: number;
};

export type { Mechanic, EmploymentType };
