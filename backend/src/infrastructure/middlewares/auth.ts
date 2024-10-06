import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../status-codes";
import { verifyJWTToken } from "../jwt";
import { BusinessException } from "../errors";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  let token = req.headers["authorization"];
  try {
    if (!token) {
      throw new BusinessException(
        "Token no proporcionado",
        StatusCodes.NOT_AUTHORIZED
      );
    }
    token = token.split(" ")[1];
    const jwtPayload = verifyJWTToken(token) as Object;
    req.body = { ...req.body, ...jwtPayload };
    next();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error interno del servidor";
    res.status(StatusCodes.NOT_AUTHORIZED).json({ message });
  }
}
