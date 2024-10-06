import { DataTypes, Model } from "sequelize";
import sequelize from "../../infrastructure/db-client";
import Project from "./project";

class User extends Model {
  public id!: number;
  public name!: string;
  public familyName!: string;
  public email!: string;
  public password!: string;
  public active!: boolean;
  public projects?: Project[];

  public addProject!: (project: Project | number) => Promise<void>;
  public getProjects!: () => Promise<Project[]>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    familyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
