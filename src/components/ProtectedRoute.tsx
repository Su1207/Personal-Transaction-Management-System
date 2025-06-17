import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { hasHydrated, user } = useAuthStore();

  console.log("ProtectedRoute: hasHydrated:", hasHydrated, "user:", user);

  useEffect(() => {
    if (hasHydrated && !user) {
      navigate("/login");
    }
  }, [hasHydrated, user]);

  return <>{user && children}</>;
}
