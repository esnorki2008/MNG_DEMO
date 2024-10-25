import axios from "axios"; // Importamos Axios para realizar solicitudes HTTP.
import Cookies from "js-cookie"; // Importamos js-cookie para manejar cookies.

const baseUrl = process.env.REACT_APP_BASE_URL; // Obtenemos la URL base desde las variables de entorno.

export const getUserData = async () => {
  const route = `${baseUrl}/user`; // Definimos la ruta para obtener los datos del usuario.
  try {
    const authToken = Cookies.get("authToken"); // Obtenemos el token de autenticación desde las cookies.
    // Realizamos una solicitud GET para obtener los datos del usuario.
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Incluimos el token de autenticación en los encabezados.
      },
    });

    return response.data; // Devolvemos los datos de la respuesta.
  } catch (error) {
    console.error(`Error fetching: ${route}`, error); // Mostramos un error si ocurre durante la solicitud.
    throw error; // Lanzamos el error para manejarlo fuera de la función.
  }
};

export const getUserProjects = async () => {
  const route = `${baseUrl}/user/projects`; // Definimos la ruta para obtener los proyectos del usuario.
  try {
    const authToken = Cookies.get("authToken"); // Obtenemos el token de autenticación desde las cookies.
    // Realizamos una solicitud GET para obtener los proyectos del usuario.
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Incluimos el token de autenticación en los encabezados.
      },
    });

    return response.data; // Devolvemos los datos de la respuesta.
  } catch (error) {
    console.error(`Error fetching: ${route}`, error); // Mostramos un error si ocurre durante la solicitud.
    throw error; // Lanzamos el error para manejarlo fuera de la función.
  }
};

export const getUnassignedUsersToProject = async (projectId: string) => {
  const route = `${baseUrl}/user/unassigned/project/${projectId}`; // Definimos la ruta para obtener los usuarios no asignados a un proyecto.
  try {
    const authToken = Cookies.get("authToken"); // Obtenemos el token de autenticación desde las cookies.
    // Realizamos una solicitud GET para obtener los usuarios no asignados a un proyecto específico.
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Incluimos el token de autenticación en los encabezados.
      },
    });

    return response.data; // Devolvemos los datos de la respuesta.
  } catch (error) {
    console.error(`Error fetching: ${route}`, error); // Mostramos un error si ocurre durante la solicitud.
    throw error; // Lanzamos el error para manejarlo fuera de la función.
  }
};
