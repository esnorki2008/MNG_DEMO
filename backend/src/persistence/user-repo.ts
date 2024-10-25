// Importamos la clase Op de Sequelize para realizar consultas avanzadas.
import { Op } from "sequelize";
// Importamos las entidades Project y User desde el dominio.
import Project from "../domain/entities/project";
import User from "../domain/entities/user";

// Definimos la interfaz para los parámetros de creación de un usuario.
export interface CreateUserRepoParams {
  name: string; // Nombre del usuario.
  familyName: string; // Apellido del usuario.
  password: string; // Contraseña del usuario.
  email: string; // Correo electrónico del usuario.
}

export default class UserRepo {
  // Método para crear un nuevo usuario en la base de datos.
  async create(params: CreateUserRepoParams) {
    const user = await User.create({ ...params }); // Creamos el usuario con los parámetros proporcionados.
    return user; // Devolvemos el usuario creado.
  }

  // Método para obtener un usuario por su correo electrónico.
  async getByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email, // Condición de búsqueda por correo electrónico.
      },
    });
    return user; // Devolvemos el usuario encontrado.
  }

  // Método para obtener un usuario por su correo electrónico y contraseña.
  async getByEmailAndPassword(email: string, password: string) {
    const user = await User.findOne({
      where: {
        email, // Condición de búsqueda por correo electrónico.
        password, // Condición de búsqueda por contraseña.
      },
    });
    return user; // Devolvemos el usuario encontrado.
  }

  // Método para obtener un usuario por su ID.
  async getById(id: number) {
    const user = await User.findByPk(id); // Buscamos el usuario por su clave primaria (ID).
    return user; // Devolvemos el usuario encontrado.
  }

  // Método para obtener todos los proyectos asociados a un usuario.
  async getAllProjects(id: number) {
    const user = await User.findOne({
      where: { id }, // Condición de búsqueda por ID de usuario.
      include: [
        {
          model: Project, // Incluimos los proyectos relacionados al usuario.
          as: "projects", // Relación alias 'projects'.
          through: { attributes: [] }, // Excluimos los atributos intermedios de la tabla pivot.
        },
      ],
    });
    return user; // Devolvemos el usuario con sus proyectos asociados.
  }

  // Método para obtener todos los usuarios no asignados a un proyecto específico.
  async getAllUnassignedUsersByProject(projectId: number) {
    const unassignedUsers = await User.findAll({
      include: [
        {
          model: Project, // Incluimos el modelo de Project.
          required: false, // Indicamos que la inclusión no es obligatoria.
          where: {
            id: projectId, // Condición de búsqueda por ID de proyecto.
          },
          through: { attributes: [] }, // Excluimos los atributos intermedios de la tabla pivot.
        },
      ],
      where: {
        "$Projects.id$": { [Op.is]: null }, // Condición de búsqueda para usuarios no asignados a proyectos.
      },
    });

    return unassignedUsers; // Devolvemos la lista de usuarios no asignados.
  }
}
