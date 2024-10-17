import Project from "../domain/entities/project";
import User from "../domain/entities/user";

export interface CreateProjectRepoParams {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export default class ProjectRepo {
  async create(params: CreateProjectRepoParams) {
    const project = await Project.create({ ...params });
    return project;
  }
  async getById(id: number) {
    const project = await Project.findByPk(id);
    return project;
  }

  async addUser(userId: number, projectId: number) {
    const project = await Project.findByPk(projectId);
    const user = await User.findByPk(userId);
    if (!project || !user) {
      throw new Error("User or Project not found");
    }
    await project.addUser(user);
  }

  async getAlIssues(id: number) {
    const project = await Project.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "issues",
          through: { attributes: [] },
        },
      ],
    });
    return project;
  }

  async getAllUsers(id: number) {
    const project = await Project.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "users",
          through: { attributes: [] },
        },
      ],
    });
    return project;
  }
}
