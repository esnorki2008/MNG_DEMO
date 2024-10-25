// Importamos el repositorio de usuarios y otros módulos necesarios.
import UserRepo from "../persistence/user-repo";
import { Router, Request, Response } from "express"; // Importamos los tipos de Router, Request y Response de Express.
import { handleError } from "../infrastructure/middlewares/handler-error"; // Importamos el middleware de manejo de errores.
import AuthService from "../service/auth-service"; // Importamos el servicio de autenticación.
import { StatusCodes } from "../infrastructure/status-codes"; // Importamos los códigos de estado HTTP.

// Inicializamos el repositorio de usuarios y el servicio de autenticación.
const userRepo = new UserRepo();
const authService = new AuthService(userRepo);

// Creamos una instancia de Router para definir las rutas.
const router = Router();

// Definimos la ruta POST para el login de usuarios.
router.post(
  "/login",
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de autenticación para iniciar sesión con los datos recibidos en el body.
    const users = await authService.login(req.body);
    // Respondemos con un código de estado OK (200) y los datos del usuario autenticado.
    res.status(StatusCodes.OK).json(users);
  })
);

// Definimos la ruta GET para validar la autenticación de usuarios.
router.get(
  "/",
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de autenticación para validar la sesión del usuario.
    const users = await authService.validate(req.body);
    // Respondemos con un código de estado OK (200) y los datos de validación.
    res.status(StatusCodes.OK).json(users);
  })
);

// Exportamos el router para que pueda ser usado en otras partes de la aplicación.
export default router;
