import axios from "axios"; // Importamos Axios para realizar solicitudes HTTP.
import Cookies from "js-cookie"; // Importamos js-cookie para manejar cookies.

const baseUrl = process.env.REACT_APP_BASE_URL; // Obtenemos la URL base de las variables de entorno.

export const login = async (email: string, password: string) => {
  try {
    // Realizamos una solicitud POST al endpoint de login con el correo y la contraseña.
    const response = await axios.post(`${baseUrl}/auth/login`, {
      email,
      password,
    });

    return response.data; // Devolvemos los datos de la respuesta.
  } catch (error) {
    console.error("Error during login:", error); // Mostramos un error si ocurre durante el login.
    throw error; // Lanzamos el error para manejarlo fuera de la función.
  }
};

export const validateSession = async () => {
  try {
    const authToken = Cookies.get("authToken"); // Obtenemos el token de autenticación desde las cookies.
    // Realizamos una solicitud GET al endpoint de validación de sesión con el token de autenticación.
    const response = await axios.get(`${baseUrl}/auth`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Incluimos el token en los encabezados de la solicitud.
      },
    });
    return response.data; // Devolvemos los datos de la respuesta.
  } catch (error) {
    console.error("Error during session validation:", error); // Mostramos un error si ocurre durante la validación.
    throw error; // Lanzamos el error para manejarlo fuera de la función.
  }
};

export const signup = async ({
  name,
  familyName,
  email,
  password,
}: {
  name: string;
  familyName: string;
  email: string;
  password: string;
}) => {
  try {
    // Realizamos una solicitud POST al endpoint de registro con los datos del nuevo usuario.
    const response = await axios.post(`${baseUrl}/signup`, {
      name,
      familyName,
      email,
      password,
    });

    return response.data; // Devolvemos los datos de la respuesta.
  } catch (error) {
    console.error("Error during signup:", error); // Mostramos un error si ocurre durante el registro.
    throw error; // Lanzamos el error para manejarlo fuera de la función.
  }
};
