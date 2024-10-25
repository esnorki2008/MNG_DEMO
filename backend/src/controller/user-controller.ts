// Importamos el servicio y repositorio de usuarios, así como Router, Request y Response de Express.
import UserSevice from "../service/user-service";
import UserRepo from "../persistence/user-repo";
import { Router, Request, Response } from "express";
// Importamos el middleware para manejar errores y el de autenticación.
import { handleError } from "../infrastructure/middlewares/handler-error";
import { authenticate } from "../infrastructure/middlewares/auth";

// Inicializamos el repositorio y servicio de usuarios.
const userRepo = new UserRepo();
const userService = new UserSevice(userRepo);

// Creamos una instancia de Router para definir las rutas.
const router = Router();

// Definimos la ruta GET para obtener los datos de un usuario.
router.get(
  "/",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de usuarios para obtener los detalles de un usuario.
    const users = await userService.get(req.body);
    // Respondemos con los datos del usuario.
    res.json(users);
  })
);

// Definimos la ruta GET para obtener los usuarios no asignados a un proyecto específico.
router.get(
  "/unassigned/project/:id",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    const projectId = req.params.id; // Obtenemos el ID del proyecto desde los parámetros de la ruta.
    const data = {
      ...req.body, // Combinamos los datos del body con el ID del proyecto.
      projectId,
    };

    // Llamamos al servicio de usuarios para obtener todos los usuarios no asignados a este proyecto.
    const users = await userService.getAllUnasignedUsers(data);
    // Respondemos con la lista de usuarios no asignados.
    res.json(users);
  })
);

// Definimos la ruta GET para obtener todos los proyectos de un usuario.
router.get(
  "/projects",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de usuarios para obtener todos los proyectos asociados al usuario.
    const users = await userService.getAllProjects(req.body);
    // Respondemos con la lista de proyectos del usuario.
    res.json(users);
  })
);

// Definimos la ruta POST para crear un nuevo usuario.
router.post(
  "/",
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de usuarios para crear un nuevo usuario con los datos proporcionados.
    const users = await userService.create(req.body);
    // Respondemos con los detalles del usuario creado.
    res.json(users);
  })
);

// Exportamos el router para que pueda ser utilizado en otras partes de la aplicación.
export default router;
