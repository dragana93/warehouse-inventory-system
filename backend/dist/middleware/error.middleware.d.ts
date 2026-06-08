import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    statusCode: number;
    isValidation: boolean;
    constructor(statusCode: number, message: string, isValidation?: boolean);
}
export declare function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error.middleware.d.ts.map