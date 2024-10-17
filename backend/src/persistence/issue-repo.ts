import Issue from "../domain/entities/issue";
import { IssueStatus } from "../infrastructure/value-objects/IssueStatus";
import { IssueType } from "../infrastructure/value-objects/IssueType";

export interface CreateIssueParams {
  projectId: number;
  title: string;
  description: string;
  status: string;
  type: IssueType;
  dueDate: Date;
  detail: Object;
}

export default class IssueRepo {
  async create(params: CreateIssueParams) {
    const { title, description, projectId, dueDate, type, detail } = params;
    const newIssue = await Issue.create({
      title: title,
      description: description,
      status: IssueStatus.OPEN,
      type,
      projectId: projectId,
      dueDate,
      detail,
      changes: [],
    });
    return newIssue;
  }

  async getById(id: number) {
    const issue = await Issue.findByPk(id);
    return issue;
  }

  async updateIssue(updatedData: Issue) {
    await updatedData.save({ silent: true });
    return updatedData;
  }
}
