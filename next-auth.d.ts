import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT, DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@/types/users";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      image: string;
      role: UserRole;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: UserRole;
  }
}