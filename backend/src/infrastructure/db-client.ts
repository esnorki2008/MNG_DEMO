import { Sequelize } from "sequelize";

//const DB_CLIENT = new Sequelize({
//  dialect: "sqlite",
//  storage: "./database.sqlite",
//});

const DB_CLIENT = new Sequelize(process.env.DATABASE_URL || "", {
  dialect: "mysql",
  logging: false, // Desactiva el logging de Sequelize (opcional)
});

export default DB_CLIENT;
