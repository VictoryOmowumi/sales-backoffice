import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (role: "executive" | "sales" | "gtm") => {
    console.log("Login button clicked for role:", role);
    try {
      await login({ role });
      console.log("Login successful");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
    <div className="p-6 border rounded-xl bg-card">
      <h1 className="font-display text-xl mb-2">Sign in</h1>
      <div className="flex gap-2">
        <Button onClick={() => handleLogin("executive")}>Login as Executive</Button>
        <Button variant="secondary" onClick={() => handleLogin("sales")}>Login as Sales</Button>
      </div>
      <Button variant="secondary" onClick={() => handleLogin("gtm")}>Login as GTM</Button>
    </div>
  </div>
  );
}
