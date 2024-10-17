import { DataTypes, Model } from "sequelize";
import sequelize from "../../infrastructure/db-client";
import Project from "./project";

class Issue extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: string;
  public projectId!: number;
  public dueDate!: Date;
  public type!: string;
  public parentIssueId!: number | null;
  public dependsOnIssueId!: number | null;
  public changes!: object[];
  public detail!: object;
}
Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    detail: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: Project,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    parentIssueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "issues",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    dependsOnIssueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "issues",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "Issue",
    tableName: "issues",
    timestamps: true,
  }
);

export default Issue;
