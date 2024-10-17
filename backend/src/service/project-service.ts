import {
  AssignUserProjectServiceParams,
  AssignUserProjectServiceResponse,
  CreateProjectServiceParams,
  CreateProjectServiceResponse,
  GetAllIssuesProjectServiceParams,
  GetAllIssuesProjectServiceResponse,
  GetAllUsersProjectServiceParams,
  GetAllUsersProjectServiceResponse,
} from "../infrastructure/dtos/project-dto";
import { BusinessException } from "../infrastructure/errors";
import { StatusCodes } from "../infrastructure/status-codes";
import ProjectRepo from "../persistence/project-repo";
import UserRepo from "../persistence/user-repo";

export default class ProjectService {
  projectRepo: ProjectRepo;
  userRepo: UserRepo;
  constructor(projectRepo: ProjectRepo, userRepo: UserRepo) {
    this.projectRepo = projectRepo;
    this.userRepo = userRepo;
  }

  async create(
    params: CreateProjectServiceParams
  ): Promise<CreateProjectServiceResponse> {
    const project = await this.projectRepo.create({ ...params });
    if (!project) {
      throw new BusinessException(
        "Error creando proyecto",
        StatusCodes.CONFLICT
      );
    }

    const user = await this.userRepo.getById(params.userId);
    if (!user) {
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    await this.projectRepo.addUser(user.id, project.id);

    return {
      projectId: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    };
  }

  async get(params: any) {
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      endDate: project.endDate,
    };
  }

  async getAlIssues(
    params: GetAllIssuesProjectServiceParams
  ): Promise<GetAllIssuesProjectServiceResponse> {
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    const projectIssues = await project.getIssues();
    const issues = projectIssues.map((issue) => ({
      issueId: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      type: issue.type,
      dueDate: issue.dueDate,
      detail: issue.detail,
    }));

    return {
      issues,
    };
  }

  async getAllUsers(
    params: GetAllUsersProjectServiceParams
  ): Promise<GetAllUsersProjectServiceResponse> {
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    const projectUsers = await project.getUsers();
    const users = projectUsers.map((user) => ({
      userId: user.id,
      name: user.name,
      familyName: user.familyName,
      email: user.email,
    }));

    return {
      users,
    };
  }

  async assignUser(
    params: AssignUserProjectServiceParams
  ): Promise<AssignUserProjectServiceResponse> {
    const user = await this.userRepo.getById(params.assigneeId);
    if (!user) {
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    await this.projectRepo.addUser(user.id, project.id);
    const projectUsers = await project.getUsers();
    const users = projectUsers.map((user) => ({
      userId: user.id,
      name: user.name,
      familyName: user.familyName,
      email: user.email,
    }));
    return {
      projectId: project.id,
      users,
    };
  }
}
