import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from './../components/Loader';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="flex justify-center items-center"> <Loader /> </div>;

  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
