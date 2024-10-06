import { DataTypes, Model } from "sequelize";
import sequelize from "../../infrastructure/db-client";
import Issue from "./issue";

class Attachment extends Model {
  public id!: number;
  public url!: string;
  public title!: string;
  public description!: string;
  public issueId!: number;
}

Attachment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    issueId: {
      type: DataTypes.INTEGER,
      references: {
        model: Issue,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Attachment",
    tableName: "attachments",
    timestamps: true,
  }
);

export default Attachment;
