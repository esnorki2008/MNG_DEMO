import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "./status-codes";
import { BusinessException } from "./errors";

const SECRET_KEY = "env.secretkey";
const JWT_EXPIRATION_TIME = "1h";

export function generateJWTToken(payload: object): string {
  const token = jwt.sign({ ...payload }, SECRET_KEY, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  return token;
}

export function verifyJWTToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch {
    throw new BusinessException(
      "Error validando token",
      StatusCodes.NOT_AUTHORIZED
    );
  }
}
