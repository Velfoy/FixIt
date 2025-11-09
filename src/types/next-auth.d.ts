import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "ADMIN" | "MECHANIC" | "WAREHOUSE" | "CLIENT" | string | undefined;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string | undefined;
  }
}
