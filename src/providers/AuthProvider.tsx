// src/providers/AuthProvider.tsx
import { useMemo, useState, type ReactNode } from "react";
import { AuthCtx, type UserRole, type User } from "../context/AuthContext";

type Ctx = {
  user: User;
  login: (payload?: Partial<User>) => Promise<void>;
  logout: () => void;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    // Initialize from sessionStorage on mount
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (payload?: Partial<User>) => {
    // TODO: replace with real API
    const newUser = { id: "u1", name: payload?.name ?? "Victory", role: (payload?.role as UserRole) ?? "executive" };
    setUser(newUser);
    // Persist to sessionStorage
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };
  
  const logout = () => {
    setUser(null);
    // Clear from sessionStorage
    sessionStorage.removeItem("user");
  };

  const value = useMemo<Ctx>(() => ({ user, login, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
