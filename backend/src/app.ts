import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/request.logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import categoryRoutes from "./categories/category.routes";
import productRoutes from "./products/product.routes";
import inventoryRoutes from "./inventory/inventory.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/inventory", inventoryRoutes);

app.use(errorMiddleware);

export default app;
