
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on auth status
  return <Navigate to={isAuthenticated ? "/" : "/login"} />;
};

export default Index;
