import { createContext } from "react";

export type UserRole = "executive" | "gtm" | "sales";
export type User = { id: string; name: string; role: UserRole } | null;

type Ctx = {
  user: User;
  login: (payload?: Partial<User>) => Promise<void>;
  logout: () => void;
};

export const AuthCtx = createContext<Ctx | undefined>(undefined);
