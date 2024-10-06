import express, { Request, Response } from "express";
import sequelize from "./infrastructure/db-client";
import userController from "./controller/user-controller";
import authController from "./controller/auth-controller";
import projectController from "./controller/project-controller";
import defineRelations from "./domain/relations";
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

// Middleware para parsear JSON
app.use(cors());
app.use(express.json());
// Cargar relaciones
defineRelations();
// Usar el router de usuarios en la ruta /users
app.use("/user", userController);
app.use("/auth", authController);
app.use("/project", projectController);

// Ruta inicial
app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenido a la API de Usuarios");
});

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log("Base de datos sincronizada");
  });
});
