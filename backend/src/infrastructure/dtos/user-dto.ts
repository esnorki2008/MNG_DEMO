export interface CreateUserServiceParams {
  name: string;
  familyName: string;
  password: string;
  email: string;
}

export interface CreateUserServiceResponse {
  authToken: string;
}

export interface ProjectsUserSevice {
  projectId: number;
  name: string;
}

export interface GetProjectsUserSeviceParams {
  userId: number;
}

export interface GetProjectsUserSeviceResponse {
  projects: ProjectsUserSevice[];
}

export interface GetDataUserSeviceParams {
  userId: number;
}

export interface GetDataUserSeviceResponse {
  name: string;
  familyName: string;
  password: string;
  email: string;
}
