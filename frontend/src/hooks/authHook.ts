import { useState, useEffect } from "react";
import { AuthToken } from "../models/auth"; // Importamos el modelo de AuthToken.
import { validateSession } from "../services/authService"; // Importamos el servicio para validar la sesión.

export const useValidateSessionHook = () => {
  const [session, setState] = useState<AuthToken | null>(null); // Estado para la sesión del usuario.
  const [sessionLoading, setLoading] = useState<boolean>(true); // Estado para controlar la carga.
  const [sessionError, setError] = useState<string | null>(null); // Estado para manejar errores.

  useEffect(() => {
    // Función asíncrona para validar la sesión.
    const fetch = async () => {
      try {
        const data = await validateSession(); // Validamos la sesión llamando al servicio.
        setState(data); // Guardamos los datos de la sesión.
      } catch (err) {
        setError("Failed to fetch session."); // Si ocurre un error, lo guardamos.
      } finally {
        setLoading(false); // Indicamos que la carga ha finalizado.
      }
    };

    fetch(); // Ejecutamos la función al montar el componente.
  }, []);

  return { session, sessionLoading, sessionError }; // Devolvemos los valores necesarios para el componente que use el hook.
};
