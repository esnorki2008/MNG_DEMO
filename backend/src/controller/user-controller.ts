import UserSevice from "../service/user-service";
import UserRepo from "../persistence/user-repo";
import { Router, Request, Response } from "express";
import { handleError } from "../infrastructure/middlewares/handler-error";
import { authenticate } from "../infrastructure/middlewares/auth";

const userRepo = new UserRepo();
const userService = new UserSevice(userRepo);

const router = Router();

router.get(
  "/",
  authenticate,
  handleError(async (req: Request, res: Response) => {
    const users = await userService.get(req.body);
    res.json(users);
  })
);

router.get(
  "/unassigned/project/:id",
  authenticate,
  handleError(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const data = {
      ...req.body,
      projectId,
    };

    const users = await userService.getAllUnasignedUsers(data);
    res.json(users);
  })
);

router.get(
  "/projects",
  authenticate,
  handleError(async (req: Request, res: Response) => {
    const users = await userService.getAllProjects(req.body);
    res.json(users);
  })
);

router.post(
  "/",
  handleError(async (req: Request, res: Response) => {
    const users = await userService.create(req.body);
    res.json(users);
  })
);

export default router;
