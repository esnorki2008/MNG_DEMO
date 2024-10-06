import Project from "../domain/entities/project";
import User from "../domain/entities/user";

export interface CreateUserRepoParams {
  name: string;
  familyName: string;
  password: string;
  email: string;
}

export default class UserRepo {
  async create(params: CreateUserRepoParams) {
    const user = await User.create({ ...params });
    return user;
  }

  async getByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async getByEmailAndPassword(email: string, password: string) {
    const user = await User.findOne({
      where: {
        email,
        password,
      },
    });
    return user;
  }
  async getById(id: number) {
    const user = await User.findByPk(id);
    return user;
  }

  async getAllProjects(id: number) {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Project,
          as: "projects",
          through: { attributes: [] },
        },
      ],
    });
    return user;
  }
}
