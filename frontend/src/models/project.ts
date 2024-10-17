export interface CreateProject {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface UnassignedUsers {
  projectId: string;
  users: UserProject[];
}

export interface UserProject {
  userId: number;
  name: string;
  familyName: string;
  email: string;
}
