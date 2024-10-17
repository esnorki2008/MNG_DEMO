import axios from "axios";
import Cookies from "js-cookie";
import { CreateProject } from "../models/project";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const createProject = async (project: CreateProject) => {
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.post(`${baseUrl}/project`, project, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectData = async (id: number) => {
  const route = `${baseUrl}/project/${id}`;
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

export const getProjectIssues = async (id: number) => {
  const route = `${baseUrl}/project/${id}/issues`;
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

export const assignToProject = async (projectId: number, userId: number) => {
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.post(
      `${baseUrl}/project/${projectId}/assign`,
      { assigneeId: userId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning project:", error);
    throw error;
  }
};

export const createIssueInProject = async (projectId: number, payload: any) => {
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.post(
      `${baseUrl}/issue`,
      { projectId, ...payload },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning project:", error);
    throw error;
  }
};

export const updateStatusIssueInProject = async (payload: any) => {
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.patch(`${baseUrl}/issue`, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning project:", error);
    throw error;
  }
};
