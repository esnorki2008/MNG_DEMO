// Importamos Router, Request y Response desde Express para la creación de rutas y manejo de solicitudes/respuestas.
import { Router, Request, Response } from "express";
// Importamos el middleware para manejar errores.
import { handleError } from "../infrastructure/middlewares/handler-error";
// Importamos los códigos de estado HTTP.
import { StatusCodes } from "../infrastructure/status-codes";
// Importamos los repositorios de issues y proyectos.
import IssueRepo from "../persistence/issue-repo";
import ProjectRepo from "../persistence/project-repo";
// Importamos el servicio de issues.
import IssueService from "../service/issue-service";

// Inicializamos los repositorios.
const issueRepo = new IssueRepo();
const projectRepo = new ProjectRepo();

// Inicializamos el servicio de issues con los repositorios necesarios.
const issueService = new IssueService(projectRepo, issueRepo);

// Creamos una instancia de Router para definir las rutas.
const router = Router();

// Definimos la ruta POST para la creación de un nuevo issue.
router.post(
  "/",
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de issues para crear un nuevo issue con los datos proporcionados en el body.
    const users = await issueService.create(req.body);
    // Respondemos con un código de estado OK (200) y los detalles del issue creado.
    res.status(StatusCodes.OK).json(users);
  })
);

// Definimos la ruta PATCH para actualizar un issue existente.
router.patch(
  "/",
  handleError(async (req: Request, res: Response) => {
    // Llamamos al servicio de issues para actualizar el issue con los datos proporcionados en el body.
    const users = await issueService.update(req.body);
    // Respondemos con un código de estado OK (200) y los detalles del issue actualizado.
    res.status(StatusCodes.OK).json(users);
  })
);

// Definimos la ruta GET para obtener los detalles de un issue por su ID.
router.get(
  "/:id",
  handleError(async (req: Request, res: Response) => {
    const issueId = Number(req.params.id); // Obtenemos el ID del issue desde los parámetros de la ruta.
    // Llamamos al servicio de issues para obtener los detalles del issue por su ID.
    const users = await issueService.get(issueId);
    // Respondemos con un código de estado OK (200) y los detalles del issue.
    res.status(StatusCodes.OK).json(users);
  })
);

// Definimos la ruta POST para agregar un archivo adjunto a un issue.
router.post(
  "/:id/attachment",
  handleError(async (req: Request, res: Response) => {
    const issueId = Number(req.params.id); // Obtenemos el ID del issue desde los parámetros de la ruta.
    const payload = { ...req.body, issueId }; // Combinamos los datos del body con el ID del issue.
    // Llamamos al servicio de issues para agregar el archivo adjunto al issue.
    const attachmentUrl = await issueService.attachment(payload);
    // Respondemos con un código de estado OK (200) y la URL del archivo adjunto.
    res.status(StatusCodes.OK).json(attachmentUrl);
  })
);

// Exportamos el router para que pueda ser utilizado en otras partes de la aplicación.
export default router;
