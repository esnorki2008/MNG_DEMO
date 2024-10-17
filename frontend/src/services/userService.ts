import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getUserData = async () => {
  const route = `${baseUrl}/user`;
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetch: ${route}`, error);
    throw error;
  }
};

export const getUserProjects = async () => {
  const route = `${baseUrl}/user/projects`;
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetch: ${route}`, error);
    throw error;
  }
};

export const getUnassignedUsersToProject = async (projectId: string) => {
  const route = `${baseUrl}/user/unassigned/project/${projectId}`;
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetch: ${route}`, error);
    throw error;
  }
};
