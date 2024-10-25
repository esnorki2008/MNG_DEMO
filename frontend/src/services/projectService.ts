import axios from "axios"; // Import axios for making HTTP requests
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import { CreateProject } from "../models/project"; // Import the CreateProject type from models

const baseUrl = process.env.REACT_APP_BASE_URL;
// Get the base URL for the API from environment variables

export const createProject = async (project: CreateProject) => {
  // Function to create a new project
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.post(`${baseUrl}/project`, project, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Include the auth token in the request headers
      },
    });
    return response.data;
    // Return the data from the response
  } catch (error) {
    console.error("Error creating project:", error);
    // Log an error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const getProjectData = async (id: number) => {
  // Function to fetch project data by project ID
  const route = `${baseUrl}/project/${id}`;
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Include the auth token in the request headers
      },
    });

    return response.data;
    // Return the project data from the response
  } catch (error) {
    console.error(`Error fetch: ${route}`, error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const getProjectIssues = async (id: number) => {
  // Function to fetch issues associated with a project by project ID
  const route = `${baseUrl}/project/${id}/issues`;
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Include the auth token in the request headers
      },
    });

    return response.data;
    // Return the issues data from the response
  } catch (error) {
    console.error(`Error fetch: ${route}`, error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const assignToProject = async (projectId: number, userId: number) => {
  // Function to assign a user to a project
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.post(
      `${baseUrl}/project/${projectId}/assign`,
      { assigneeId: userId },
      // Payload with the user ID to assign
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Include the auth token in the request headers
        },
      }
    );
    return response.data;
    // Return the response data
  } catch (error) {
    console.error("Error assigning project:", error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const createIssueInProject = async (projectId: number, payload: any) => {
  // Function to create an issue in a project
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.post(
      `${baseUrl}/issue`,
      { projectId, ...payload },
      // Payload including the project ID and issue data
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Include the auth token in the request headers
        },
      }
    );
    return response.data;
    // Return the response data
  } catch (error) {
    console.error("Error assigning project:", error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const createAttachmentIssue = async (issueId: number, payload: any) => {
  // Function to add an attachment to an issue
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.post(
      `${baseUrl}/issue/${issueId}/attachment`,
      { ...payload },
      // Payload with attachment data
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Include the auth token in the request headers
        },
      }
    );
    return response.data;
    // Return the response data
  } catch (error) {
    console.error("Error creating attachment:", error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const getIssue = async (issueId: number) => {
  // Function to fetch issue details by issue ID
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.get(`${baseUrl}/issue/${issueId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Include the auth token in the request headers
      },
    });
    return response.data;
    // Return the issue data from the response
  } catch (error) {
    console.error("Error assigning project:", error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};

export const updateStatusIssueInProject = async (payload: any) => {
  // Function to update the status of an issue in a project
  try {
    const authToken = Cookies.get("authToken");
    // Retrieve the auth token from cookies
    const response = await axios.patch(`${baseUrl}/issue`, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Include the auth token in the request headers
      },
    });
    return response.data;
    // Return the response data
  } catch (error) {
    console.error("Error assigning project:", error);
    // Log the error if the request fails
    throw error;
    // Rethrow the error to be handled by the caller
  }
};
