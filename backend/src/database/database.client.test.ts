import prisma from './database.client';

jest.mock('./database.client');

describe('DatabaseClient', () => {
  it('should export the database client', () => {
    expect(prisma).toBeDefined();
  });
});

