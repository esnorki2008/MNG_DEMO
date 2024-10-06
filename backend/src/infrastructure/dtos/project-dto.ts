export interface CreateProjectServiceParams {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface CreateProjectServiceResponse {
  projectId: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface UserInfoProjectServiceRecord {
  userId: number;
  name: string;
  familyName: string;
  email: string;
}

export interface AssignUserProjectServiceParams {
  assigneeId: number;
  projectId: number;
}

export interface AssignUserProjectServiceResponse {
  projectId: number;
  users: UserInfoProjectServiceRecord[];
}

export interface GetAllUsersProjectServiceParams {
  projectId: number;
}

export interface GetAllUsersProjectServiceResponse {
  users: UserInfoProjectServiceRecord[];
}
