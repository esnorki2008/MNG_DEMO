import user from "../domain/entities/user";
import {
  ValidateAuthServiceParams,
  ValidateAuthServiceResponse,
} from "../infrastructure/dtos/auth-dto";
import {
  CreateIssueServiceParams,
  CreateIssueServiceResponse,
  UpdateIssueServiceParams,
  UpdateIssueServiceResponse,
} from "../infrastructure/dtos/issue-dto";

import { BusinessException } from "../infrastructure/errors";
import { StatusCodes } from "../infrastructure/status-codes";
import IssueRepo from "../persistence/issue-repo";
import ProjectRepo from "../persistence/project-repo";

export default class IssueService {
  projectRepo: ProjectRepo;
  issueRepo: IssueRepo;

  constructor(projectRepo: ProjectRepo, issueRepo: IssueRepo) {
    this.projectRepo = projectRepo;
    this.issueRepo = issueRepo;
  }

  async create(
    params: CreateIssueServiceParams
  ): Promise<CreateIssueServiceResponse> {
    const { projectId, title, description, status, type, dueDate, detail } =
      params;
    const project = await this.projectRepo.getById(projectId);
    if (!project) {
      throw new BusinessException("Project not found", StatusCodes.CONFLICT);
    }
    const newProject = await this.issueRepo.create({
      projectId,
      title,
      description,
      status,
      type,
      dueDate,
      detail: [detail],
    });
    return {
      issueId: newProject.id,
      projectId,
      title,
      description,
      status,
      type,
      dueDate,
    };
  }

  async update(
    params: UpdateIssueServiceParams
  ): Promise<UpdateIssueServiceResponse> {
    const {
      issueId,
      projectId,
      title,
      description,
      status,
      type,
      dueDate,
      detail,
    } = params;

    const project = await this.projectRepo.getById(projectId);
    if (!project) {
      throw new BusinessException("Project not found", StatusCodes.CONFLICT);
    }

    const issue = await this.issueRepo.getById(issueId);
    if (!issue) {
      throw new BusinessException("Issue not found", StatusCodes.CONFLICT);
    }
    issue.id = issueId;
    issue.projectId = projectId;
    issue.title = title;
    issue.description = description;
    issue.status = status;
    issue.type = type;
    issue.dueDate = dueDate;
    issue.detail = detail;
    issue.changes.push(params);

    await this.issueRepo.updateIssue(issue);

    return { ...params };
  }
}
