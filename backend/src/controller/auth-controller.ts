import UserRepo from "../persistence/user-repo";
import { Router, Request, Response } from "express";
import { handleError } from "../infrastructure/middlewares/handler-error";
import AuthService from "../service/auth-service";
import { StatusCodes } from "../infrastructure/status-codes";

const userRepo = new UserRepo();
const authService = new AuthService(userRepo);

const router = Router();

router.post(
  "/",
  handleError(async (req: Request, res: Response) => {
    const users = await authService.login(req.body);
    res.status(StatusCodes.OK).json(users);
  })
);

export default router;
