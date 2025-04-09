
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { isAdmin } from "@/api/admin";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(adminOnly);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const adminStatus = await isAdmin();
        setIsAuthorized(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify admin permissions.",
        });
      } finally {
        setIsChecking(false);
      }
    };

    if (adminOnly && user) {
      checkAdminStatus();
    }
  }, [user, adminOnly, toast]);

  if (loading || (adminOnly && isChecking)) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "Please login to view this page.",
    });
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAuthorized) {
    toast({
      variant: "destructive",
      title: "Admin Access Required",
      description: "You don't have permission to access this page.",
    });
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
