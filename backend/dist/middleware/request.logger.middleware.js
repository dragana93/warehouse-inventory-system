"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = require("../utils/logger");
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        logger_1.logger.info("Request", {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: Date.now() - start,
        });
    });
    next();
}
//# sourceMappingURL=request.logger.middleware.js.map