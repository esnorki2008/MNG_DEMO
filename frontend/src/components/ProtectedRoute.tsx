import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authToken = Cookies.get("authToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("authToken");
    navigate("/login");
  };

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow p-6 bg-gray-50">{children}</main>
    </div>
  );
};

export default ProtectedRoute;
