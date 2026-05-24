import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const ProtectedRoute = ({ roles, children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-shell grid place-items-center text-slate-500">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

