import { IssueType } from "../value-objects/IssueType";

export interface CreateIssueServiceParams {
  projectId: number;
  detail: object;
  title: string;
  description: string;
  status: string;
  type: IssueType;
  dueDate: Date;
}

export interface CreateIssueServiceResponse {
  issueId: number;
  projectId: number;
  title: string;
  description: string;
  status: string;
  type: IssueType;
  dueDate: Date;
}

export interface UpdateIssueServiceParams {
  issueId: number;
  detail: object;
  projectId: number;
  title: string;
  description: string;
  status: string;
  type: IssueType;
  dueDate: Date;
}

export interface UpdateIssueServiceResponse {
  issueId: number;
  projectId: number;
  title: string;
  description: string;
  status: string;
  type: IssueType;
  dueDate: Date;
}
