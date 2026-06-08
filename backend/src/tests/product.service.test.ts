import { ProductService } from "../services/product.service";
import { AppError } from "../middleware/error.middleware";

const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("../utils/prisma", () => ({ default: mockPrisma }));

const mockProduct = {
  id: 1,
  code: "PRD-001",
  name: "Water Bottle",
  price: 1.5,
  quantity: 100,
  categoryId: 1,
  category: { id: 1, name: "Beverages" },
};

describe("ProductService", () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns all products with category", async () => {
      mockPrisma.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.getAll();

      expect(result).toEqual([mockProduct]);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({ include: { category: true } });
    });
  });

  describe("getById", () => {
    it("returns the product when found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getById(1);

      expect(result).toEqual(mockProduct);
    });

    it("throws AppError 404 when product not found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toThrow(
        new AppError(404, "Product not found")
      );
    });
  });

  describe("create", () => {
    it("creates and returns a new product", async () => {
      const dto = {
        code: "PRD-001",
        name: "Water Bottle",
        price: 1.5,
        quantity: 100,
        categoryId: 1,
      };
      mockPrisma.product.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toMatchObject(dto);
      expect(mockPrisma.product.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe("update", () => {
    it("updates the product when found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      const updated = { ...mockProduct, name: "Updated Bottle" };
      mockPrisma.product.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: "Updated Bottle" });

      expect(result).toEqual(updated);
    });

    it("throws AppError 404 when product not found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { name: "X" })).rejects.toThrow(
        new AppError(404, "Product not found")
      );
    });
  });

  describe("delete", () => {
    it("deletes the product when found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.product.delete.mockResolvedValue(mockProduct);

      const result = await service.delete(1);

      expect(result).toEqual(mockProduct);
    });

    it("throws AppError 404 when product not found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(
        new AppError(404, "Product not found")
      );
    });
  });
});
