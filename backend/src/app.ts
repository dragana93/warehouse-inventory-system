import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/request.logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(errorMiddleware);

export default app;
