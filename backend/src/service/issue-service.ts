import {
  CreateIssueServiceParams,
  CreateIssueServiceResponse,
  UpdateIssueServiceParams,
  UpdateIssueServiceResponse,
} from "../infrastructure/dtos/issue-dto"; // Importamos los tipos de parámetros y respuestas para la creación y actualización de issues.
import { BusinessException } from "../infrastructure/errors"; // Excepción personalizada para manejar errores específicos de negocio.
import { StatusCodes } from "../infrastructure/status-codes"; // Códigos de estado estándar para respuestas HTTP.
import IssueRepo from "../persistence/issue-repo"; // Repositorio para interactuar con la base de datos de issues.
import ProjectRepo from "../persistence/project-repo"; // Repositorio para interactuar con la base de datos de proyectos.
import AWS from "aws-sdk"; // SDK de AWS para interactuar con servicios como S3.
import { v4 as uuidv4 } from "uuid"; // Utilidad para generar identificadores únicos.
import dotenv from "dotenv"; // Biblioteca para cargar variables de entorno desde un archivo .env.

dotenv.config(); // Cargamos las variables de entorno desde el archivo .env.
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Usamos la clave de acceso de AWS desde las variables de entorno.
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Usamos la clave secreta de AWS desde las variables de entorno.
  region: process.env.AWS_REGION, // Definimos la región de AWS desde las variables de entorno.
});
const bucketName = process.env.AWS_BUCKET_NAME ?? "si"; // Nombre del bucket de S3, si no está definido en el entorno, usa "si" por defecto.

export default class IssueService {
  projectRepo: ProjectRepo; // Repositorio para proyectos.
  issueRepo: IssueRepo; // Repositorio para issues.

  constructor(projectRepo: ProjectRepo, issueRepo: IssueRepo) {
    this.projectRepo = projectRepo; // Inicializamos el repositorio de proyectos.
    this.issueRepo = issueRepo; // Inicializamos el repositorio de issues.
  }

  // Método para crear un nuevo issue.
  async create(
    params: CreateIssueServiceParams
  ): Promise<CreateIssueServiceResponse> {
    const { projectId, title, description, status, type, dueDate, detail } =
      params; // Extraemos los parámetros del request.

    // Verificamos si el proyecto existe en la base de datos.
    const project = await this.projectRepo.getById(projectId);
    if (!project) {
      throw new BusinessException("Project not found", StatusCodes.CONFLICT); // Lanzamos una excepción si el proyecto no existe.
    }

    // Creamos el nuevo issue usando el repositorio.
    const newProject = await this.issueRepo.create({
      projectId,
      title,
      description,
      status,
      type,
      dueDate,
      detail: detail,
    });

    // Retornamos la respuesta con los datos del nuevo issue creado.
    return {
      issueId: newProject.id,
      projectId,
      title,
      description,
      status,
      type,
      dueDate,
    };
  }

  // Método para obtener los detalles de un issue por su ID.
  async get(id: number) {
    const issue = await this.issueRepo.getById(id); // Buscamos el issue en la base de datos.
    if (!issue) {
      throw new BusinessException("Issue not found", StatusCodes.CONFLICT); // Si no existe, lanzamos una excepción.
    }

    // Retornamos los detalles del issue.
    return {
      issueId: issue.id,
      projectId: issue.projectId,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      type: issue.type,
      dueDate: issue.dueDate,
      detail: issue.detail,
    };
  }

  // Método para agregar un archivo adjunto a un issue.
  async attachment(payload: any) {
    const issue = await this.issueRepo.getById(payload.issueId); // Obtenemos el issue desde la base de datos.
    if (!issue) {
      throw new BusinessException("Issue not found", StatusCodes.CONFLICT); // Si el issue no existe, lanzamos una excepción.
    }

    // Obtenemos el detalle del issue y verificamos si ya tiene archivos adjuntos.
    const detail: any = issue.detail;
    let attachments = detail.attachments;

    if (!attachments || attachments.length === 0) {
      attachments = []; // Si no hay adjuntos, inicializamos un array vacío.
    }

    // Generamos una clave única para el nuevo archivo adjunto.
    const key = uuidv4();
    const params = {
      Bucket: bucketName, // Definimos el bucket donde se almacenará el archivo.
      Key: key, // Clave del archivo.
      Expires: 60, // Tiempo de expiración del enlace prefirmado.
      ContentType: payload.fileType, // Tipo de archivo.
    };

    // Generamos un enlace prefirmado para la subida del archivo a S3.
    const presignedUrl = await s3.getSignedUrlPromise("putObject", params);
    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`; // Generamos la URL pública del archivo adjunto.

    // Añadimos el nuevo adjunto a la lista de attachments.
    attachments.push({
      url: publicUrl,
      type: payload.fileType,
      key,
      title: payload.title,
      description: payload.description,
    });
    detail.attachments = attachments; // Actualizamos los detalles del issue con el nuevo adjunto.

    // Guardamos los cambios en el issue.
    issue.setDataValue("detail", detail);
    issue.changed("detail", true);
    await issue.save();

    return { presignedUrl }; // Retornamos la URL prefirmada.
  }

  // Método para actualizar los detalles de un issue existente.
  async update(
    params: UpdateIssueServiceParams
  ): Promise<UpdateIssueServiceResponse> {
    const {
      issueId,
      projectId,
      title,
      description,
      status,
      type,
      dueDate,
      detail,
    } = params; // Extraemos los parámetros de actualización.

    // Verificamos si el proyecto existe.
    const project = await this.projectRepo.getById(projectId);
    if (!project) {
      throw new BusinessException("Project not found", StatusCodes.CONFLICT); // Lanzamos una excepción si el proyecto no se encuentra.
    }

    // Verificamos si el issue existe.
    const issue = await this.issueRepo.getById(issueId);
    if (!issue) {
      throw new BusinessException("Issue not found", StatusCodes.CONFLICT); // Si el issue no se encuentra, lanzamos una excepción.
    }

    // Actualizamos los valores del issue con los nuevos datos.
    issue.id = issueId;
    issue.projectId = projectId;
    issue.title = title;
    issue.description = description;
    issue.status = status;
    issue.type = type;
    issue.dueDate = dueDate;
    issue.detail = detail;
    issue.changes.push(params); // Guardamos un registro de los cambios realizados.

    // Guardamos los cambios en la base de datos.
    await this.issueRepo.updateIssue(issue);

    return { ...params }; // Retornamos los nuevos detalles del issue.
  }
}
