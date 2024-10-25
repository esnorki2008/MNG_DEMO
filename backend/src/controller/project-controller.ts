// Importamos los repositorios, Router y Request/Response de Express.
import ProjectRepo from "../persistence/project-repo";
import { Router, Request, Response } from "express";
// Importamos el middleware para manejar errores y los códigos de estado HTTP.
import { handleError } from "../infrastructure/middlewares/handler-error";
import { StatusCodes } from "../infrastructure/status-codes";
// Importamos el servicio de proyectos y el repositorio de usuarios.
import ProjectService from "../service/project-service";
import UserRepo from "../persistence/user-repo";
// Importamos el middleware de autenticación.
import { authenticate } from "../infrastructure/middlewares/auth";

// Inicializamos los repositorios y servicios.
const projectRepo = new ProjectRepo();
const userRepo = new UserRepo();
const projectService = new ProjectService(projectRepo, userRepo);

// Creamos una instancia de Router para definir las rutas.
const router = Router();

// Definimos la ruta POST para crear un nuevo proyecto.
router.post(
  "/",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de proyectos para crear un nuevo proyecto.
    const projects = await projectService.create(req.body);
    // Respondemos con un código de estado OK (200) y los detalles del proyecto creado.
    res.status(StatusCodes.OK).json(projects);
  })
);

// Definimos la ruta POST para asignar un usuario a un proyecto específico.
router.post(
  "/:id/assign",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    const projectId = req.params.id; // Obtenemos el ID del proyecto desde los parámetros de la ruta.
    const data = {
      ...req.body, // Combinamos los datos del body con el ID del proyecto.
      projectId,
    };
    // Llamamos al servicio de proyectos para asignar un usuario al proyecto.
    const projects = await projectService.assignUser(data);
    // Respondemos con un código de estado OK (200) y los detalles del proyecto con el usuario asignado.
    res.status(StatusCodes.OK).json(projects);
  })
);

// Definimos la ruta GET para obtener los detalles de un proyecto por su ID.
router.get(
  "/:id",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    const projectId = Number(req.params.id); // Convertimos el ID del proyecto a número.
    const data = {
      projectId,
    };
    // Llamamos al servicio de proyectos para obtener los detalles del proyecto.
    const projects = await projectService.get(data);
    // Respondemos con un código de estado OK (200) y los detalles del proyecto.
    res.status(StatusCodes.OK).json(projects);
  })
);

// Definimos la ruta GET para obtener todos los usuarios asignados a un proyecto.
router.get(
  "/:id/assign",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    const projectId = Number(req.params.id); // Convertimos el ID del proyecto a número.
    const data = {
      projectId,
    };
    // Llamamos al servicio de proyectos para obtener todos los usuarios asignados al proyecto.
    const projects = await projectService.getAllUsers(data);
    // Respondemos con un código de estado OK (200) y los detalles de los usuarios asignados.
    res.status(StatusCodes.OK).json(projects);
  })
);

// Definimos la ruta GET para obtener todos los issues de un proyecto.
router.get(
  "/:id/issues",
  authenticate, // Middleware de autenticación para proteger la ruta.
  handleError(async (req: Request, res: Response) => {
    const projectId = Number(req.params.id); // Convertimos el ID del proyecto a número.
    const data = {
      projectId,
    };
    // Llamamos al servicio de proyectos para obtener todos los issues del proyecto.
    const projects = await projectService.getAlIssues(data);
    // Respondemos con un código de estado OK (200) y los detalles de los issues del proyecto.
    res.status(StatusCodes.OK).json(projects);
  })
);

// Exportamos el router para que pueda ser utilizado en otras partes de la aplicación.
export default router;
