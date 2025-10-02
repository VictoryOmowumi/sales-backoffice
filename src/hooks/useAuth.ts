import { useContext } from "react";
import { AuthCtx } from "@/context/AuthContext";

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    console.error("useAuth must be used within AuthProvider");
    return {
      user: null,
      login: async () => {
        console.error("Login function not available - AuthProvider not found");
      },
      logout: () => {
        console.error("Logout function not available - AuthProvider not found");
      }
    };
  }
  return ctx;
};
