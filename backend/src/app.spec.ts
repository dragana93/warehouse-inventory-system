import request from 'supertest';
import app from './app';
import prisma from './database/database.client';

jest.mock('./database/database.client');

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Categories ───────────────────────────────────────────────────────────────

describe('GET /categories', () => {
  it('returns 200 with list of categories', async () => {
    (prisma.category.findMany as jest.Mock).mockResolvedValue([{ id: 1, name: 'Beverages' }]);

    const res = await request(app).get('/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Beverages' }]);
  });
});

describe('GET /categories/summary', () => {
  it('returns 200 with stock totals per category', async () => {
    (prisma.category.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Beverages', products: [{ quantity: 80 }, { quantity: 40 }] },
    ]);

    const res = await request(app).get('/categories/summary');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Beverages', totalStock: 120 }]);
  });
});

describe('POST /categories', () => {
  it('returns 201 with the created category', async () => {
    (prisma.category.create as jest.Mock).mockResolvedValue({ id: 2, name: 'Snacks' });

    const res = await request(app).post('/categories').send({ name: 'Snacks' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, name: 'Snacks' });
  });
});

describe('PUT /categories/:id', () => {
  it('returns 200 with the updated category', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Old' });
    (prisma.category.update as jest.Mock).mockResolvedValue({ id: 1, name: 'New' });

    const res = await request(app).put('/categories/1').send({ name: 'New' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'New' });
  });

  it('returns 404 when category does not exist', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).put('/categories/99').send({ name: 'X' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('DELETE /categories/:id', () => {
  it('returns 204 when category is deleted', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Beverages' });
    (prisma.category.delete as jest.Mock).mockResolvedValue({});

    const res = await request(app).delete('/categories/1');

    expect(res.status).toBe(204);
  });

  it('returns 404 when category does not exist', async () => {
    (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete('/categories/99');

    expect(res.status).toBe(404);
  });
});

// ─── Products ─────────────────────────────────────────────────────────────────

const product = { id: 1, code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 };

describe('GET /products', () => {
  it('returns 200 with paginated product list', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([product]);
    (prisma.product.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/products?page=1&pageSize=10');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [product], total: 1, page: 1, pageSize: 10 });
  });

  it('supports search, category filter, code filter and sorting', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([product]);
    (prisma.product.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/products?search=cola&categoryId=1&code=P001&sortBy=name&sortOrder=asc');

    expect(res.status).toBe(200);
  });
});

describe('GET /products/:id', () => {
  it('returns 200 with product details', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);

    const res = await request(app).get('/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(product);
  });

  it('returns 404 when product does not exist', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/products/99');

    expect(res.status).toBe(404);
  });
});

describe('POST /products', () => {
  it('returns 201 with created product', async () => {
    (prisma.product.create as jest.Mock).mockResolvedValue(product);

    const res = await request(app)
      .post('/products')
      .send({ code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(product);
  });
});

describe('PUT /products/:id', () => {
  it('returns 200 with updated product', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
    (prisma.product.update as jest.Mock).mockResolvedValue({ ...product, name: 'Cola Updated' });

    const res = await request(app)
      .put('/products/1')
      .send({ code: 'P001', name: 'Cola Updated', price: 1.5, quantity: 10, categoryId: 1 });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Cola Updated');
  });

  it('returns 404 when product does not exist', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).put('/products/99').send({});

    expect(res.status).toBe(404);
  });
});

describe('DELETE /products/:id', () => {
  it('returns 204 when product is deleted', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
    (prisma.product.delete as jest.Mock).mockResolvedValue({});

    const res = await request(app).delete('/products/1');

    expect(res.status).toBe(204);
  });

  it('returns 404 when product does not exist', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete('/products/99');

    expect(res.status).toBe(404);
  });
});

// ─── Inventory ────────────────────────────────────────────────────────────────

describe('POST /inventory/:productId/increase', () => {
  it('returns 200 with updated quantity', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
    (prisma.product.update as jest.Mock).mockResolvedValue({ ...product, quantity: 15 });
    (prisma.inventoryHistory.create as jest.Mock).mockResolvedValue({});

    const res = await request(app).post('/inventory/1/increase').send({ amount: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, quantity: 15 });
  });

  it('returns 404 when product does not exist', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post('/inventory/99/increase').send({ amount: 5 });

    expect(res.status).toBe(404);
  });
});

describe('POST /inventory/:productId/decrease', () => {
  it('returns 200 with updated quantity', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
    (prisma.product.update as jest.Mock).mockResolvedValue({ ...product, quantity: 7 });
    (prisma.inventoryHistory.create as jest.Mock).mockResolvedValue({});

    const res = await request(app).post('/inventory/1/decrease').send({ amount: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, quantity: 7 });
  });

  it('returns 400 when stock would become negative', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);

    const res = await request(app).post('/inventory/1/decrease').send({ amount: 100 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 404 when product does not exist', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post('/inventory/99/decrease').send({ amount: 1 });

    expect(res.status).toBe(404);
  });
});

// ─── Audit Log / History ──────────────────────────────────────────────────────

const historyEntry = {
  id: 1,
  productId: 1,
  oldQuantity: 10,
  newQuantity: 15,
  action: 'increase',
  timestamp: new Date().toISOString(),
};

describe('GET /history', () => {
  it('returns 200 with all audit log entries', async () => {
    (prisma.inventoryHistory.findMany as jest.Mock).mockResolvedValue([historyEntry]);

    const res = await request(app).get('/history');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('GET /history/:productId', () => {
  it('returns 200 with audit log entries for a product', async () => {
    (prisma.inventoryHistory.findMany as jest.Mock).mockResolvedValue([historyEntry]);

    const res = await request(app).get('/history/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
