import { useEffect, useState } from "react"; // Import React hooks
import {
  assignToProject, // Service to assign a user to a project
  createIssueInProject, // Service to create an issue in a project
  createProject, // Service to create a new project
  getProjectData, // Service to fetch project data
  getProjectIssues, // Service to fetch issues in a project
  updateStatusIssueInProject, // Service to update issue status in a project
} from "../services/projectService";
import { CreateProject } from "../models/project"; // Import the CreateProject model

// Hook to handle project creation
export const useCreateProjectHook = () => {
  const [project, setProject] = useState<CreateProject | null>(null); // State to store project data
  const [projectLoading, setLoading] = useState<boolean>(false); // State to manage loading status
  const [projectError, setError] = useState<string | null>(null); // State to manage error messages

  const createNewProject = async (projectData: CreateProject) => {
    setLoading(true); // Set loading state to true while fetching
    setError(null); // Reset error state

    try {
      const data = await createProject(projectData); // Call the service to create a project
      setProject(data); // Store the created project data in state
    } catch (err) {
      setError("Failed to fetch project data."); // Set error message in case of failure
    } finally {
      setLoading(false); // Set loading state to false after request is complete
    }
  };

  return { project, projectLoading, projectError, createNewProject }; // Return state and function
};

// Hook to assign a user to a project
export const useAssignToProjectHook = () => {
  const [projectAssign, setProject] = useState<CreateProject | null>(null); // State for project assignment
  const [projectAssignLoading, setLoading] = useState<boolean>(false); // State to manage loading status
  const [projectAssignError, setError] = useState<string | null>(null); // State to manage error messages

  const assignUserToProject = async (projectId: number, userId: number) => {
    setLoading(true); // Set loading state to true while fetching
    setError(null); // Reset error state

    try {
      const data = await assignToProject(projectId, userId); // Call the service to assign a user to a project
      setProject(data); // Store the updated project data in state
    } catch (err) {
      setError("Failed to assign to project."); // Set error message in case of failure
    } finally {
      setLoading(false); // Set loading state to false after request is complete
    }
  };

  return {
    projectAssign,
    projectAssignLoading,
    projectAssignError,
    assignUserToProject,
  }; // Return state and function
};

// Hook to create an issue in a project
export const useAssignIssueToProjectHook = () => {
  const [issueCreate, setProject] = useState<any | null>(null); // State to store issue creation data
  const [issueCreateLoading, setLoading] = useState<boolean>(false); // State to manage loading status
  const [issueCreateError, setError] = useState<string | null>(null); // State to manage error messages

  const createProject = async (projectId: number, payload: any) => {
    setLoading(true); // Set loading state to true while fetching
    setError(null); // Reset error state

    try {
      const data = await createIssueInProject(projectId, payload); // Call the service to create an issue
      setProject(data); // Store the created issue data in state
    } catch (err) {
      setError("Failed to create issue."); // Set error message in case of failure
    } finally {
      setLoading(false); // Set loading state to false after request is complete
    }
  };

  return {
    issueCreate,
    issueCreateLoading,
    issueCreateError,
    createProject,
  }; // Return state and function
};

// Hook to update the status of an issue in a project
export const useUpdateIssueToProjectHook = () => {
  const [issueProjectUpdate, setProject] = useState<any | null>(null); // State to store updated issue data
  const [issueProjectUpdateLoading, setLoading] = useState<boolean>(false); // State to manage loading status
  const [issueProjectUpdateError, setError] = useState<string | null>(null); // State to manage error messages

  const updateIssueStatusProject = async (payload: any) => {
    setLoading(true); // Set loading state to true while fetching
    setError(null); // Reset error state

    try {
      const data = await updateStatusIssueInProject(payload); // Call the service to update the issue status
      setProject(data); // Store the updated issue data in state
    } catch (err) {
      setError("Failed to update issue status."); // Set error message in case of failure
    } finally {
      setLoading(false); // Set loading state to false after request is complete
    }
  };

  return {
    issueProjectUpdate,
    issueProjectUpdateLoading,
    issueProjectUpdateError,
    updateIssueStatusProject,
  }; // Return state and function
};

// Hook to fetch issue data by issue ID
export const useIssueData = (issueId: number) => {
  const [issueData, setState] = useState<any | null>(null); // State to store issue data
  const [issueDataLoading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [issueDataError, setError] = useState<string | null>(null); // State to manage error messages

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectData(issueId); // Call the service to fetch issue data
        setState(data); // Store the fetched issue data in state
      } catch (err) {
        setError("Failed to fetch issue data."); // Set error message in case of failure
      } finally {
        setLoading(false); // Set loading state to false after request is complete
      }
    };

    fetch(); // Fetch the data when component mounts
  }, [issueId]);

  return { issueData, issueDataLoading, issueDataError }; // Return state and loading/error statuses
};

// Hook to fetch project data by project ID
export const useProjectDataHook = (projectId: number) => {
  const [projectData, setState] = useState<any | null>(null); // State to store project data
  const [projectDataLoading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [projectDataError, setError] = useState<string | null>(null); // State to manage error messages

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectData(projectId); // Call the service to fetch project data
        setState(data); // Store the fetched project data in state
      } catch (err) {
        setError("Failed to fetch project data."); // Set error message in case of failure
      } finally {
        setLoading(false); // Set loading state to false after request is complete
      }
    };

    fetch(); // Fetch the data when component mounts
  }, [projectId]);

  return { projectData, projectDataLoading, projectDataError }; // Return state and loading/error statuses
};

// Hook to fetch project issues by project ID
export const useProjectIssuesHook = (projectId: number) => {
  const [projectIssues, setState] = useState<any | null>(null); // State to store project issues
  const [projectIssuesLoading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [projectIssuesError, setError] = useState<string | null>(null); // State to manage error messages

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectIssues(projectId); // Call the service to fetch project issues
        setState(data); // Store the fetched issues in state
      } catch (err) {
        setError("Failed to fetch project issues."); // Set error message in case of failure
      } finally {
        setLoading(false); // Set loading state to false after request is complete
      }
    };

    fetch(); // Fetch the data when component mounts
  }, [projectId]);

  return { projectIssues, projectIssuesLoading, projectIssuesError }; // Return state and loading/error statuses
};
