import {
  LoginAuthServiceParams,
  LoginAuthServiceResponse,
  ValidateAuthServiceParams,
  ValidateAuthServiceResponse,
} from "../infrastructure/dtos/auth-dto";

import { BusinessException } from "../infrastructure/errors";
import { generateJWTToken } from "../infrastructure/jwt";
import { StatusCodes } from "../infrastructure/status-codes";
import UserRepo from "../persistence/user-repo";

export default class AuthService {
  userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async login(
    params: LoginAuthServiceParams
  ): Promise<LoginAuthServiceResponse> {
    const { email, password } = params;
    const user = await this.userRepo.getByEmailAndPassword(email, password);
    if (!user) {
      throw new BusinessException(
        "Credenciales incorrectas",
        StatusCodes.CONFLICT
      );
    }
    const authToken = generateJWTToken({
      userId: user.id,
    });
    return {
      authToken,
    };
  }

  async validate(
    params: ValidateAuthServiceParams
  ): Promise<ValidateAuthServiceResponse> {
    const { userId } = params;
    const authToken = generateJWTToken({
      userId: userId,
    });
    return {
      authToken,
    };
  }
}
