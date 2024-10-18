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

router.get(
  "/:id",
  handleError(async (req: Request, res: Response) => {
    const issueId = Number(req.params.id);
    const users = await issueService.get(issueId);
    res.status(StatusCodes.OK).json(users);
  })
);
router.post(
  "/:id/attachment",
  handleError(async (req: Request, res: Response) => {
    const issueId = Number(req.params.id);
    const payload = { ...req.body, issueId };
    const attachmentUrl = await issueService.attachment(payload);
    res.status(StatusCodes.OK).json(attachmentUrl);
  })
);

export default router;
