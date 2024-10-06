import { DataTypes, Model } from "sequelize";
import sequelize from "../../infrastructure/db-client";
import User from "./user";

class Project extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public active!: boolean;
  public users?: User[];

  public addUser!: (user: User | number) => Promise<void>;
  public getUsers!: () => Promise<User[]>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    timestamps: true,
  }
);

export default Project;
