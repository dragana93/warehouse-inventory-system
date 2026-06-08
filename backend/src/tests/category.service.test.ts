import { CategoryService } from "../services/category.service";

const mockPrisma = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("../utils/prisma", () => ({ default: mockPrisma }));

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns all categories", async () => {
      const categories = [{ id: 1, name: "Beverages" }];
      mockPrisma.category.findMany.mockResolvedValue(categories);

      const result = await service.getAll();

      expect(result).toEqual(categories);
      expect(mockPrisma.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    it("returns a category by id", async () => {
      const category = { id: 1, name: "Beverages" };
      mockPrisma.category.findUnique.mockResolvedValue(category);

      const result = await service.getById(1);

      expect(result).toEqual(category);
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("returns null when category not found", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      const result = await service.getById(99);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("creates and returns a new category", async () => {
      const created = { id: 2, name: "Snacks" };
      mockPrisma.category.create.mockResolvedValue(created);

      const result = await service.create({ name: "Snacks" });

      expect(result).toEqual(created);
      expect(mockPrisma.category.create).toHaveBeenCalledWith({ data: { name: "Snacks" } });
    });
  });

  describe("update", () => {
    it("updates and returns the category", async () => {
      const updated = { id: 1, name: "Beverages Updated" };
      mockPrisma.category.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: "Beverages Updated" });

      expect(result).toEqual(updated);
      expect(mockPrisma.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "Beverages Updated" },
      });
    });
  });

  describe("delete", () => {
    it("deletes the category and returns it", async () => {
      const deleted = { id: 1, name: "Beverages" };
      mockPrisma.category.delete.mockResolvedValue(deleted);

      const result = await service.delete(1);

      expect(result).toEqual(deleted);
      expect(mockPrisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
