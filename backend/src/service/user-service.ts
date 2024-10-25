// Importamos los tipos de parámetros y respuestas para los servicios relacionados con usuarios.
import {
  CreateUserServiceParams,
  CreateUserServiceResponse,
  GetDataUserSeviceParams,
  GetDataUserSeviceResponse,
  GetProjectsUserSeviceParams,
  GetProjectsUserSeviceResponse,
  GetUnassignUsersByProjectSeviceParams,
  GetUnassignUsersByProjectSeviceResponse,
} from "../infrastructure/dtos/user-dto";

// Importamos excepciones personalizadas, funciones de JWT y códigos de estado.
import { BusinessException } from "../infrastructure/errors";
import { generateJWTToken } from "../infrastructure/jwt";
import { StatusCodes } from "../infrastructure/status-codes";

// Importamos el repositorio de usuarios.
import UserRepo from "../persistence/user-repo";

export default class UserSevice {
  userRepo: UserRepo; // Repositorio de usuarios.

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo; // Inicializamos el repositorio de usuarios.
  }

  // Método para crear un nuevo usuario.
  async create(
    params: CreateUserServiceParams
  ): Promise<CreateUserServiceResponse> {
    const { email } = params; // Extraemos el correo de los parámetros.

    // Verificamos si el usuario ya existe en la base de datos.
    const user = await this.userRepo.getByEmail(email);
    if (user) {
      // Si el usuario ya existe, lanzamos una excepción de conflicto.
      throw new BusinessException(
        "Usuario con el correo solicitado ya existe",
        StatusCodes.CONFLICT
      );
    }

    // Creamos el nuevo usuario con los datos proporcionados.
    const newUser = await this.userRepo.create({ ...params });

    // Generamos un token JWT para el nuevo usuario.
    const authToken = generateJWTToken({
      userId: newUser.id,
    });

    // Devolvemos el token de autenticación.
    return {
      authToken,
    };
  }

  // Método para obtener todos los proyectos de un usuario.
  async getAllProjects(
    params: GetProjectsUserSeviceParams
  ): Promise<GetProjectsUserSeviceResponse> {
    const { userId } = params; // Extraemos el ID del usuario.

    // Buscamos el usuario por su ID.
    const user = await this.userRepo.getById(userId);
    if (!user) {
      // Si el usuario no existe, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Obtenemos todos los proyectos del usuario.
    const userProjects = await user.getProjects();
    const response = [];

    // Iteramos sobre los proyectos y mapeamos sus issues.
    for (const project of userProjects) {
      const issues = await project.getIssues();
      const mappedIssues = issues.map((issue) => ({
        title: issue.title,
        status: issue.status,
      }));

      // Mapeamos el proyecto con sus detalles e issues.
      const mappedProject = {
        projectId: project.id,
        dueDate: project.endDate,
        description: project.description,
        name: project.name,
        issues: mappedIssues,
      };

      // Añadimos el proyecto mapeado a la respuesta.
      response.push(mappedProject);
    }

    // Devolvemos la lista de proyectos con sus detalles.
    return { projects: response };
  }

  // Método para obtener los datos de un usuario por su ID.
  async get(
    params: GetDataUserSeviceParams
  ): Promise<GetDataUserSeviceResponse> {
    const { userId } = params; // Extraemos el ID del usuario.

    // Buscamos el usuario por su ID.
    const user = await this.userRepo.getById(userId);
    if (!user) {
      // Si el usuario no se encuentra, lanzamos una excepción de no encontrado.
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    // Devolvemos los detalles del usuario.
    return {
      name: user.name,
      familyName: user.familyName,
      password: user.password,
      email: user.email,
    };
  }

  // Método para obtener todos los usuarios no asignados a un proyecto específico.
  async getAllUnasignedUsers(
    params: GetUnassignUsersByProjectSeviceParams
  ): Promise<GetUnassignUsersByProjectSeviceResponse> {
    const { projectId } = params; // Extraemos el ID del proyecto.

    // Obtenemos todos los usuarios no asignados al proyecto.
    const users = await this.userRepo.getAllUnassignedUsersByProject(projectId);

    // Mapeamos los usuarios para devolver solo los detalles relevantes.
    const unassignedUsers = users.map((user) => ({
      userId: user.id,
      name: user.name,
      familyName: user.familyName,
      password: user.password,
      email: user.email,
    }));

    // Devolvemos la lista de usuarios no asignados.
    return { users: unassignedUsers };
  }
}
