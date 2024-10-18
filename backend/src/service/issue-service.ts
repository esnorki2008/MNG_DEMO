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
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const bucketName = process.env.AWS_BUCKET_NAME ?? "si";

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
      detail: detail,
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

  async get(id: number) {
    const issue = await this.issueRepo.getById(id);
    if (!issue) {
      throw new BusinessException("Issue not found", StatusCodes.CONFLICT);
    }

    return {
      issueId: issue.id,
      projectId: issue.projectId,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      type: issue.type,
      dueDate: issue.dueDate,
      detail: issue.detail,
    };
  }

  async attachment(payload: any) {
    const issue = await this.issueRepo.getById(payload.issueId);
    if (!issue) {
      throw new BusinessException("Issue not found", StatusCodes.CONFLICT);
    }
    const detail: any = issue.detail;
    let attachments = detail.attachments;

    if (!attachments || attachments.length === 0) {
      attachments = [];
    }

    const key = uuidv4();
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60,
      ContentType: payload.fileType,
    };

    const presignedUrl = await s3.getSignedUrlPromise("putObject", params);
    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    attachments.push({
      url: publicUrl,
      type: payload.fileType,
      key,
      title: payload.title,
      description: payload.description,
    });
    detail.attachments = attachments;

    issue.setDataValue("detail", detail);
    issue.changed("detail", true);
    await issue.save();

    return { presignedUrl };
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
