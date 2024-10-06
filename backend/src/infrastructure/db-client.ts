import { Sequelize } from "sequelize";

const DB_CLIENT = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

export default DB_CLIENT;
