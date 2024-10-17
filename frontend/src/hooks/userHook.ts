import { useState, useEffect } from "react";
import {
  getUnassignedUsersToProject,
  getUserData,
  getUserProjects,
} from "../services/userService";
import { User, UserProjects } from "../models/user";
import { UnassignedUsers } from "../models/project";

export const useFetchUserHook = () => {
  const [user, setState] = useState<User | null>(null);
  const [userLoading, setLoading] = useState<boolean>(true);
  const [userError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getUserData();
        setState(data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { user, userLoading, userError };
};
export const useFetchUnassignedUsersToProjectHook = (projectId: string) => {
  const [usersUnassignedProjects, setUsersUnassignedProjects] =
    useState<UnassignedUsers | null>();
  const [usersUnassignedProjectsLoading, setLoading] = useState<boolean>(true);
  const [usersUnassignedProjectsError, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchUnassignedUsers = async () => {
      try {
        const data = await getUnassignedUsersToProject(projectId);
        setUsersUnassignedProjects(data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnassignedUsers();
  }, [projectId]);

  return {
    usersUnassignedProjects,
    usersUnassignedProjectsLoading,
    usersUnassignedProjectsError,
  };
};

export const useFetchUserProjectsHook = () => {
  const [userProjects, setState] = useState<UserProjects | null>(null);
  const [userProjectsLoading, setLoading] = useState<boolean>(true);
  const [userProjectsError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getUserProjects();
        setState(data);
      } catch (err) {
        setError("Failed to fetch  data.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { userProjects, userProjectsLoading, userProjectsError };
};
