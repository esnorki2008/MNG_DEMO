import {
  LoginAuthServiceParams,
  LoginAuthServiceResponse,
  ValidateAuthServiceParams,
  ValidateAuthServiceResponse,
} from "../infrastructure/dtos/auth-dto"; // Importamos los tipos de datos para los parámetros y respuestas de los servicios de autenticación.

import { BusinessException } from "../infrastructure/errors"; // Excepción personalizada para manejar errores de negocio.
import { generateJWTToken } from "../infrastructure/jwt"; // Función que genera un token JWT.
import { StatusCodes } from "../infrastructure/status-codes"; // Códigos de estado que representan diferentes situaciones.
import UserRepo from "../persistence/user-repo"; // Repositorio para interactuar con los usuarios en la base de datos.

export default class AuthService {
  userRepo: UserRepo; // Declaramos el repositorio de usuarios.

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo; // Inicializamos el repositorio de usuarios a través del constructor.
  }

  // Método para manejar el inicio de sesión de un usuario.
  async login(
    params: LoginAuthServiceParams
  ): Promise<LoginAuthServiceResponse> {
    const { email, password } = params; // Extraemos el correo y la contraseña de los parámetros recibidos.

    // Buscamos al usuario en la base de datos usando su correo y contraseña.
    const user = await this.userRepo.getByEmailAndPassword(email, password);

    // Si no se encuentra el usuario, lanzamos una excepción de negocio con el código de conflicto.
    if (!user) {
      throw new BusinessException(
        "Credenciales incorrectas",
        StatusCodes.CONFLICT
      );
    }

    // Generamos el token JWT para el usuario autenticado.
    const authToken = generateJWTToken({
      userId: user.id, // Incluimos el ID del usuario en el token.
    });

    // Retornamos el token de autenticación.
    return {
      authToken,
    };
  }

  // Método para validar la autenticación de un usuario.
  async validate(
    params: ValidateAuthServiceParams
  ): Promise<ValidateAuthServiceResponse> {
    const { userId } = params; // Extraemos el ID del usuario de los parámetros.

    // Generamos un token JWT para validar al usuario.
    const authToken = generateJWTToken({
      userId: userId, // Incluimos el ID del usuario en el token.
    });

    // Retornamos el token de validación.
    return {
      authToken,
    };
  }
}
