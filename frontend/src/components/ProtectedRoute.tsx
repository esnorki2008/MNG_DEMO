import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useValidateSessionHook } from "../hooks/authHook";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, sessionLoading, sessionError } = useValidateSessionHook();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  if (sessionLoading) {
    return <Loading />;
  }
  const authToken = Cookies.get("authToken");

  if (redirectToHome) {
    return <Navigate to="/login" replace />;
  }

  if (!session || sessionError || redirectToLogin || !authToken) {
    Cookies.remove("authToken");
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    Cookies.remove("authToken");
    setRedirectToLogin(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center">
        <h1
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setRedirectToHome(true)}
        >
          Project Admin
        </h1>
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
