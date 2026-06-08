"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorMiddleware = errorMiddleware;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(statusCode, message, isValidation = false) {
        super(message);
        this.statusCode = statusCode;
        this.isValidation = isValidation;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof AppError) {
        if (err.isValidation) {
            logger_1.logger.warn("Validation failure", { message: err.message });
        }
        else {
            logger_1.logger.error(err.message, { stack: err.stack });
        }
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    logger_1.logger.error(err.message, { stack: err.stack });
    res.status(500).json({ message: "Internal server error" });
}
//# sourceMappingURL=error.middleware.js.map