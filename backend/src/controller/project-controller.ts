import ProjectRepo from "../persistence/project-repo";
import { Router, Request, Response } from "express";
import { handleError } from "../infrastructure/middlewares/handler-error";
import { StatusCodes } from "../infrastructure/status-codes";
import ProjectService from "../service/project-service";
import UserRepo from "../persistence/user-repo";
import { authenticate } from "../infrastructure/middlewares/auth";

const projectRepo = new ProjectRepo();
const userRepo = new UserRepo();
const projectService = new ProjectService(projectRepo, userRepo);

const router = Router();

router.post(
  "/",
  authenticate,
  handleError(async (req: Request, res: Response) => {
    const projects = await projectService.create(req.body);
    res.status(StatusCodes.OK).json(projects);
  })
);

router.post(
  "/:id/assign",
  authenticate,
  handleError(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const data = {
      ...req.body,
      projectId,
    };
    const projects = await projectService.assignUser(data);
    res.status(StatusCodes.OK).json(projects);
  })
);

router.get(
  "/:id/assign",
  authenticate,
  handleError(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const data = {
      projectId: userId,
    };
    const projects = await projectService.getAllUsers(data);
    res.status(StatusCodes.OK).json(projects);
  })
);

export default router;
