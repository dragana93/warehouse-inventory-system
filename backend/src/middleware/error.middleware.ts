import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isValidation: boolean = false
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    if (err.isValidation) {
      logger.warn("Validation failure", { message: err.message });
    } else {
      logger.error(err.message, { stack: err.stack });
    }
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ message: "Internal server error" });
}
