import { useState, useEffect } from "react";
import {
  getUnassignedUsersToProject,
  getUserData,
  getUserProjects,
} from "../services/userService"; // Importamos los servicios para obtener datos de usuarios y proyectos.
import { User, UserProjects } from "../models/user"; // Importamos los modelos de User y UserProjects.
import { UnassignedUsers } from "../models/project"; // Importamos el modelo de UnassignedUsers.

// Hook para obtener los datos del usuario.
export const useFetchUserHook = () => {
  const [user, setState] = useState<User | null>(null); // Estado para el usuario.
  const [userLoading, setLoading] = useState<boolean>(true); // Estado de carga.
  const [userError, setError] = useState<string | null>(null); // Estado para el manejo de errores.

  useEffect(() => {
    // Función asíncrona para obtener los datos del usuario.
    const fetch = async () => {
      try {
        const data = await getUserData(); // Llamamos al servicio para obtener los datos del usuario.
        setState(data); // Guardamos los datos del usuario.
      } catch (err) {
        setError("Failed to fetch user data."); // Manejamos errores.
      } finally {
        setLoading(false); // Terminamos la carga.
      }
    };

    fetch(); // Ejecutamos la función al montar el componente.
  }, []);

  return { user, userLoading, userError }; // Devolvemos los valores necesarios para el componente que use este hook.
};

// Hook para obtener los usuarios no asignados a un proyecto específico.
export const useFetchUnassignedUsersToProjectHook = (projectId: string) => {
  const [usersUnassignedProjects, setUsersUnassignedProjects] =
    useState<UnassignedUsers | null>(null); // Estado para los usuarios no asignados.
  const [usersUnassignedProjectsLoading, setLoading] = useState<boolean>(true); // Estado de carga.
  const [usersUnassignedProjectsError, setError] = useState<string | null>(
    null
  ); // Estado para el manejo de errores.

  useEffect(() => {
    // Función asíncrona para obtener los usuarios no asignados.
    const fetchUnassignedUsers = async () => {
      try {
        const data = await getUnassignedUsersToProject(projectId); // Llamamos al servicio para obtener los usuarios no asignados.
        setUsersUnassignedProjects(data); // Guardamos los datos de usuarios no asignados.
      } catch (err) {
        setError("Failed to fetch user data."); // Manejamos errores.
      } finally {
        setLoading(false); // Terminamos la carga.
      }
    };

    fetchUnassignedUsers(); // Ejecutamos la función al montar el componente.
  }, [projectId]);

  return {
    usersUnassignedProjects,
    usersUnassignedProjectsLoading,
    usersUnassignedProjectsError,
  }; // Devolvemos los valores necesarios para el componente que use este hook.
};

// Hook para obtener los proyectos del usuario.
export const useFetchUserProjectsHook = () => {
  const [userProjects, setState] = useState<UserProjects | null>(null); // Estado para los proyectos del usuario.
  const [userProjectsLoading, setLoading] = useState<boolean>(true); // Estado de carga.
  const [userProjectsError, setError] = useState<string | null>(null); // Estado para el manejo de errores.

  useEffect(() => {
    // Función asíncrona para obtener los proyectos del usuario.
    const fetch = async () => {
      try {
        const data = await getUserProjects(); // Llamamos al servicio para obtener los proyectos del usuario.
        setState(data); // Guardamos los datos de los proyectos.
      } catch (err) {
        setError("Failed to fetch data."); // Manejamos errores.
      } finally {
        setLoading(false); // Terminamos la carga.
      }
    };

    fetch(); // Ejecutamos la función al montar el componente.
  }, []);

  return { userProjects, userProjectsLoading, userProjectsError }; // Devolvemos los valores necesarios para el componente que use este hook.
};
