// Importamos la entidad Issue y los objetos de valor IssueStatus e IssueType.
import Issue from "../domain/entities/issue";
import { IssueStatus } from "../infrastructure/value-objects/IssueStatus";
import { IssueType } from "../infrastructure/value-objects/IssueType";

// Definimos la interfaz para los parámetros de creación de un issue.
export interface CreateIssueParams {
  projectId: number; // ID del proyecto al que pertenece el issue.
  title: string; // Título del issue.
  description: string; // Descripción del issue.
  status: string; // Estado del issue.
  type: IssueType; // Tipo de issue (definido en IssueType).
  dueDate: Date; // Fecha límite del issue.
  detail: Object; // Detalles adicionales del issue.
}

export default class IssueRepo {
  // Método para crear un nuevo issue.
  async create(params: CreateIssueParams) {
    const { title, description, projectId, dueDate, type, detail } = params; // Extraemos los parámetros.
    // Creamos un nuevo issue con los datos proporcionados.
    const newIssue = await Issue.create({
      title: title,
      description: description,
      status: IssueStatus.OPEN, // El estado inicial del issue es "OPEN".
      type,
      projectId: projectId,
      dueDate,
      detail,
      changes: [], // Inicializamos el array de cambios como vacío.
    });
    return newIssue; // Devolvemos el nuevo issue creado.
  }

  // Método para obtener un issue por su ID.
  async getById(id: number) {
    const issue = await Issue.findByPk(id); // Buscamos el issue por su clave primaria (ID).
    return issue; // Devolvemos el issue encontrado.
  }

  // Método para actualizar un issue con datos actualizados.
  async updateIssue(updatedData: Issue) {
    await updatedData.save({ silent: true }); // Guardamos los cambios en el issue sin disparar hooks ni eventos.
    return updatedData; // Devolvemos los datos del issue actualizado.
  }
}
