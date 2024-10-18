import express, { Request, Response } from "express";
import sequelize from "./infrastructure/db-client";
import userController from "./controller/user-controller";
import authController from "./controller/auth-controller";
import projectController from "./controller/project-controller";
import issueController from "./controller/issue-controller";
import defineRelations from "./domain/relations";

const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
defineRelations();

app.use("/user", userController);
app.use("/auth", authController);
app.use("/project", projectController);
app.use("/issue", issueController);

app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenido a la API de Usuarios");
});

console.log({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log("Base de datos sincronizada");
  });
});
