export class BusinessException extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "UserNotFoundError";
    this.statusCode = statusCode;
  }
}
