import { useEffect, useState } from "react";
import {
  assignToProject,
  createIssueInProject,
  createProject,
  getProjectData,
  getProjectIssues,
} from "../services/projectService";
import { CreateProject } from "../models/project";

export const useCreateProjectHook = () => {
  const [project, setProject] = useState<CreateProject | null>(null);
  const [projectLoading, setLoading] = useState<boolean>(false);
  const [projectError, setError] = useState<string | null>(null);

  const createNewProject = async (projectData: CreateProject) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createProject(projectData);
      setProject(data);
    } catch (err) {
      setError("Failed to fetch project data.");
    } finally {
      setLoading(false);
    }
  };

  return { project, projectLoading, projectError, createNewProject };
};

export const useAssignToProjectHook = () => {
  const [projectAssign, setProject] = useState<CreateProject | null>(null);
  const [projectAssignLoading, setLoading] = useState<boolean>(false);
  const [projectAssignError, setError] = useState<string | null>(null);

  const assignUserToProject = async (projectId: number, userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await assignToProject(projectId, userId);
      setProject(data);
    } catch (err) {
      setError("Failed to assign to project.");
    } finally {
      setLoading(false);
    }
  };

  return {
    projectAssign,
    projectAssignLoading,
    projectAssignError,
    assignUserToProject,
  };
};

export const useAssignIssueToProjectHook = () => {
  const [issueCreate, setProject] = useState<any | null>(null);
  const [issueCreateLoading, setLoading] = useState<boolean>(false);
  const [issueCreateError, setError] = useState<string | null>(null);

  const createProject = async (projectId: number, payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createIssueInProject(projectId, payload);
      setProject(data);
    } catch (err) {
      setError("Failed to create issue.");
    } finally {
      setLoading(false);
    }
  };

  return {
    issueCreate,
    issueCreateLoading,
    issueCreateError,
    createProject,
  };
};

export const useProjectDataHook = (projectId: number) => {
  const [projectData, setState] = useState<any | null>(null);
  const [projectDataLoading, setLoading] = useState<boolean>(true);
  const [projectDataError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectData(projectId);
        setState(data);
      } catch (err) {
        setError("Failed to fetch .");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { projectData, projectDataLoading, projectDataError };
};

export const useProjectIssuesHook = (projectId: number) => {
  const [projectIssues, setState] = useState<any | null>(null);
  const [projectIssuesLoading, setLoading] = useState<boolean>(true);
  const [projectIssuesError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectIssues(projectId);
        setState(data);
      } catch (err) {
        setError("Failed to fetch .");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { projectIssues, projectIssuesLoading, projectIssuesError };
};
