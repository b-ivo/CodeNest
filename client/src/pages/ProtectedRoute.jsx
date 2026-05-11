import { Navigate } from "react-router-dom";
import Loader from './../components/Loader';
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex h-screen w-screen justify-center items-center bg-gray-50">
      <Loader />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
