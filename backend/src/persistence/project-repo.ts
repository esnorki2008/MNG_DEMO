// Importamos las entidades Project y User desde el dominio.
import Project from "../domain/entities/project";
import User from "../domain/entities/user";

// Definimos la interfaz para los parámetros de creación de un proyecto.
export interface CreateProjectRepoParams {
  name: string; // Nombre del proyecto.
  description: string; // Descripción del proyecto.
  startDate: Date; // Fecha de inicio del proyecto.
  endDate: Date; // Fecha de finalización del proyecto.
}

export default class ProjectRepo {
  // Método para crear un nuevo proyecto en la base de datos.
  async create(params: CreateProjectRepoParams) {
    const project = await Project.create({ ...params }); // Creamos el proyecto con los parámetros proporcionados.
    return project; // Devolvemos el proyecto creado.
  }

  // Método para obtener un proyecto por su ID.
  async getById(id: number) {
    const project = await Project.findByPk(id); // Buscamos el proyecto por su clave primaria (ID).
    return project; // Devolvemos el proyecto encontrado.
  }

  // Método para agregar un usuario a un proyecto.
  async addUser(userId: number, projectId: number) {
    const project = await Project.findByPk(projectId); // Buscamos el proyecto por su ID.
    const user = await User.findByPk(userId); // Buscamos el usuario por su ID.
    if (!project || !user) {
      throw new Error("User or Project not found"); // Lanzamos un error si no se encuentra el usuario o el proyecto.
    }
    await project.addUser(user); // Añadimos el usuario al proyecto.
  }

  // Método para obtener todos los issues de un proyecto por su ID.
  async getAlIssues(id: number) {
    const project = await Project.findOne({
      where: { id }, // Buscamos el proyecto por su ID.
      include: [
        {
          model: User, // Incluimos el modelo de User relacionado con los issues.
          as: "issues", // Relación alias 'issues'.
          through: { attributes: [] }, // Excluimos los atributos intermedios de la tabla pivot.
        },
      ],
    });
    return project; // Devolvemos el proyecto con sus issues.
  }

  // Método para obtener todos los usuarios asignados a un proyecto.
  async getAllUsers(id: number) {
    const project = await Project.findOne({
      where: { id }, // Buscamos el proyecto por su ID.
      include: [
        {
          model: User, // Incluimos el modelo de User relacionado con los usuarios del proyecto.
          as: "users", // Relación alias 'users'.
          through: { attributes: [] }, // Excluimos los atributos intermedios de la tabla pivot.
        },
      ],
    });
    return project; // Devolvemos el proyecto con sus usuarios.
  }
}
