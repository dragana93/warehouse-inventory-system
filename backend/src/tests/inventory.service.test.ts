import { InventoryService } from "../services/inventory.service";
import { AppError } from "../middleware/error.middleware";

const mockProduct = {
  id: 1,
  code: "PRD-001",
  name: "Water Bottle",
  price: 1.5,
  quantity: 100,
  categoryId: 1,
};

const mockHistory = {
  id: 1,
  productId: 1,
  oldQuantity: 100,
  newQuantity: 80,
  action: "SALE",
  timestamp: new Date(),
};

const mockPrisma = {
  inventoryHistory: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock("../utils/prisma", () => ({ default: mockPrisma }));

describe("InventoryService", () => {
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService();
    jest.clearAllMocks();
  });

  describe("getHistory", () => {
    it("returns history ordered by timestamp desc", async () => {
      const entries = [{ ...mockHistory, product: mockProduct }];
      mockPrisma.inventoryHistory.findMany.mockResolvedValue(entries);

      const result = await service.getHistory();

      expect(result).toEqual(entries);
      expect(mockPrisma.inventoryHistory.findMany).toHaveBeenCalledWith({
        include: { product: true },
        orderBy: { timestamp: "desc" },
      });
    });
  });

  describe("updateStock", () => {
    it("throws AppError 400 when newQuantity is negative", async () => {
      await expect(service.updateStock(1, -1, "SALE")).rejects.toThrow(
        new AppError(400, "Stock cannot go below zero")
      );
      expect(mockPrisma.product.findUnique).not.toHaveBeenCalled();
    });

    it("throws AppError 404 when product not found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.updateStock(99, 50, "SALE")).rejects.toThrow(
        new AppError(404, "Product not found")
      );
    });

    it("updates stock and records history in a transaction", async () => {
      const updatedProduct = { ...mockProduct, quantity: 80 };
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.$transaction.mockResolvedValue([updatedProduct, mockHistory]);

      const result = await service.updateStock(1, 80, "SALE");

      expect(result).toEqual({ product: updatedProduct, history: mockHistory });
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("allows setting stock to zero", async () => {
      const updatedProduct = { ...mockProduct, quantity: 0 };
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.$transaction.mockResolvedValue([updatedProduct, { ...mockHistory, newQuantity: 0 }]);

      const result = await service.updateStock(1, 0, "SALE");

      expect(result.product.quantity).toBe(0);
    });
  });
});
