// Importamos los tipos de parámetros y respuestas para los servicios relacionados con proyectos.
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

// Importamos excepciones personalizadas y códigos de estado.
import { BusinessException } from "../infrastructure/errors";
import { StatusCodes } from "../infrastructure/status-codes";

// Importamos los repositorios para proyectos y usuarios.
import ProjectRepo from "../persistence/project-repo";
import UserRepo from "../persistence/user-repo";

export default class ProjectService {
  projectRepo: ProjectRepo; // Repositorio de proyectos.
  userRepo: UserRepo; // Repositorio de usuarios.

  constructor(projectRepo: ProjectRepo, userRepo: UserRepo) {
    this.projectRepo = projectRepo; // Inicializamos el repositorio de proyectos.
    this.userRepo = userRepo; // Inicializamos el repositorio de usuarios.
  }

  // Método para crear un nuevo proyecto.
  async create(
    params: CreateProjectServiceParams
  ): Promise<CreateProjectServiceResponse> {
    // Creamos el proyecto utilizando el repositorio de proyectos.
    const project = await this.projectRepo.create({ ...params });
    if (!project) {
      // Si no se puede crear el proyecto, lanzamos una excepción de conflicto.
      throw new BusinessException(
        "Error creando proyecto",
        StatusCodes.CONFLICT
      );
    }

    // Buscamos al usuario por su ID.
    const user = await this.userRepo.getById(params.userId);
    if (!user) {
      // Si no se encuentra el usuario, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Añadimos el usuario al proyecto.
    await this.projectRepo.addUser(user.id, project.id);

    // Devolvemos los detalles del proyecto recién creado.
    return {
      projectId: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    };
  }

  // Método para obtener un proyecto por su ID.
  async get(params: any) {
    // Buscamos el proyecto por su ID.
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      // Si el proyecto no se encuentra, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Devolvemos los detalles del proyecto.
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      endDate: project.endDate,
    };
  }

  // Método para obtener todos los issues de un proyecto.
  async getAlIssues(
    params: GetAllIssuesProjectServiceParams
  ): Promise<GetAllIssuesProjectServiceResponse> {
    // Buscamos el proyecto por su ID.
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      // Si el proyecto no se encuentra, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Obtenemos los issues asociados al proyecto.
    const projectIssues = await project.getIssues();
    // Mapeamos los issues para devolver solo los detalles relevantes.
    const issues = projectIssues.map((issue) => ({
      issueId: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      type: issue.type,
      dueDate: issue.dueDate,
      detail: issue.detail,
    }));

    // Devolvemos los issues del proyecto.
    return {
      issues,
    };
  }

  // Método para obtener todos los usuarios de un proyecto.
  async getAllUsers(
    params: GetAllUsersProjectServiceParams
  ): Promise<GetAllUsersProjectServiceResponse> {
    // Buscamos el proyecto por su ID.
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      // Si el proyecto no se encuentra, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Obtenemos los usuarios asociados al proyecto.
    const projectUsers = await project.getUsers();
    // Mapeamos los usuarios para devolver solo los detalles relevantes.
    const users = projectUsers.map((user) => ({
      userId: user.id,
      name: user.name,
      familyName: user.familyName,
      email: user.email,
    }));

    // Devolvemos los usuarios del proyecto.
    return {
      users,
    };
  }

  // Método para asignar un usuario a un proyecto.
  async assignUser(
    params: AssignUserProjectServiceParams
  ): Promise<AssignUserProjectServiceResponse> {
    // Buscamos al usuario por su ID.
    const user = await this.userRepo.getById(params.assigneeId);
    if (!user) {
      // Si el usuario no se encuentra, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Buscamos el proyecto por su ID.
    const project = await this.projectRepo.getById(params.projectId);
    if (!project) {
      // Si el proyecto no se encuentra, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Proyecto no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Añadimos el usuario al proyecto.
    await this.projectRepo.addUser(user.id, project.id);

    // Obtenemos los usuarios asociados al proyecto después de la asignación.
    const projectUsers = await project.getUsers();
    // Mapeamos los usuarios para devolver solo los detalles relevantes.
    const users = projectUsers.map((user) => ({
      userId: user.id,
      name: user.name,
      familyName: user.familyName,
      email: user.email,
    }));

    // Devolvemos el ID del proyecto y los usuarios asignados.
    return {
      projectId: project.id,
      users,
    };
  }
}
