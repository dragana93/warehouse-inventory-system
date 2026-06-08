import { PrismaClient } from 'generated/prisma';
import prisma from './database.client';

describe('DatabaseClient', () => {
  it('should instantiate PrismaClient once', () => {
    expect(PrismaClient).toHaveBeenCalledTimes(1);
  });

  it('should export the database client', () => {
    expect(prisma).toBeDefined();
  });
});
