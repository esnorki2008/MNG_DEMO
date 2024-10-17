import { Router, Request, Response } from "express";
import { handleError } from "../infrastructure/middlewares/handler-error";
import { StatusCodes } from "../infrastructure/status-codes";
import IssueRepo from "../persistence/issue-repo";
import ProjectRepo from "../persistence/project-repo";
import IssueService from "../service/issue-service";

const issueRepo = new IssueRepo();
const projectRepo = new ProjectRepo();

const issueService = new IssueService(projectRepo, issueRepo);

const router = Router();

router.post(
  "/",
  handleError(async (req: Request, res: Response) => {
    const users = await issueService.create(req.body);
    res.status(StatusCodes.OK).json(users);
  })
);

router.patch(
  "/",
  handleError(async (req: Request, res: Response) => {
    const users = await issueService.update(req.body);
    res.status(StatusCodes.OK).json(users);
  })
);

export default router;
