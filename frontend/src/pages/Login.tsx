import React, { useEffect, useState } from "react";
import { login } from "../services/authService"; // Importamos el servicio de autenticación.
import { useNavigate } from "react-router-dom"; // Hook para la navegación.
import Cookies from "js-cookie"; // Biblioteca para manejar cookies.
import { toast } from "react-toastify"; // Biblioteca para mostrar notificaciones.

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook para la navegación.
  const [email, setEmail] = useState<string>(""); // Estado para el email.
  const [password, setPassword] = useState<string>(""); // Estado para la contraseña.
  const [error, setError] = useState<string | null>(null); // Estado para los errores.

  // Efecto para redirigir al dashboard si el usuario ya está autenticado.
  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      navigate("/dashboard"); // Redirigimos al dashboard si ya existe el token de autenticación.
    }
  }, [navigate]);

  // Manejador para el envío del formulario.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reiniciamos el estado de error.

    try {
      const result = await login(email, password); // Llamamos al servicio de login.
      if (result.authToken) {
        Cookies.set("authToken", result.authToken, { expires: 7 }); // Guardamos el token en las cookies.
      }
      toast.success("Login successful!"); // Mostramos mensaje de éxito.
      navigate("/dashboard"); // Redirigimos al dashboard.
    } catch (error) {
      toast.error("Failed to login. Please try again."); // Mostramos mensaje de error.
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Sign in to your account
        </h2>
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Actualizamos el estado del email.
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualizamos el estado de la contraseña.
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>

        {/* Sección para crear una nueva cuenta */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")} // Redirigimos al formulario de registro.
            className="mt-2 py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
