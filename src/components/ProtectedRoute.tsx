import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { hasHydrated, user, isInitializing } = useAuthStore();

  console.log("ProtectedRoute:", { hasHydrated, user: !!user, isInitializing });

  useEffect(() => {
    if (hasHydrated && !isInitializing && !user) {
      navigate("/login");
    }
  }, [hasHydrated, user, isInitializing, navigate]);

  if (!hasHydrated || isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
