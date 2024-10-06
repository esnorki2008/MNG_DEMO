import { Model } from "sequelize";
import sequelize from "../../infrastructure/db-client";

class UserProject extends Model {
  public userId!: number;
  public projectId!: number;
}

UserProject.init(
  {},
  {
    sequelize,
    modelName: "UserProject",
    tableName: "user_projects",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "projectId"],
      },
    ],
  }
);

export default UserProject;
