export interface User {
  name: string;
  familyName: string;
  password: string;
  email: string;
}
interface UserProject {
  projectId: number;
  name: string;
  description: string;
  issues: any[];
}

export interface UserProjects {
  projects: UserProject[];
}
