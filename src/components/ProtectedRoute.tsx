import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { hasHydrated, user } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasHydrated) {
      if (!user) {
        navigate("/login", { replace: true });
      } else {
        setReady(true); // Ready to render only if authenticated
      }
    }
  }, [hasHydrated, user, navigate]);

  if (!ready)
    return (
      <div className="space-y-2 min-w-full bg-gray-900">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );

  return <>{children}</>;
}
