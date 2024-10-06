import {
  CreateUserServiceParams,
  CreateUserServiceResponse,
  GetDataUserSeviceParams,
  GetDataUserSeviceResponse,
  GetProjectsUserSeviceParams,
  GetProjectsUserSeviceResponse,
} from "../infrastructure/dtos/user-dto";
import { BusinessException } from "../infrastructure/errors";
import { generateJWTToken } from "../infrastructure/jwt";
import { StatusCodes } from "../infrastructure/status-codes";
import UserRepo from "../persistence/user-repo";

export default class UserSevice {
  userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async create(
    params: CreateUserServiceParams
  ): Promise<CreateUserServiceResponse> {
    const { email } = params;
    const user = await this.userRepo.getByEmail(email);
    if (user) {
      throw new BusinessException(
        "Usuario con el correo solicitado ya existe",
        StatusCodes.CONFLICT
      );
    }
    const newUser = await this.userRepo.create({ ...params });
    const authToken = generateJWTToken({
      userId: newUser.id,
    });
    return {
      authToken,
    };
  }

  async getAllProjects(
    params: GetProjectsUserSeviceParams
  ): Promise<GetProjectsUserSeviceResponse> {
    const { userId } = params;
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }
    const userProjects = await user.getProjects();

    const projects = userProjects.map((project) => ({
      projectId: project.id,
      name: project.name,
    }));

    return { projects };
  }

  async get(
    params: GetDataUserSeviceParams
  ): Promise<GetDataUserSeviceResponse> {
    const { userId } = params;
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new BusinessException(
        "Usuario no encontrado",
        StatusCodes.NOT_FOUND
      );
    }

    return {
      name: user.name,
      familyName: user.familyName,
      password: user.password,
      email: user.email,
    };
  }
}
