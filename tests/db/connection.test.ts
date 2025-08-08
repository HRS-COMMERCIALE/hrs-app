import { sequelize } from '../../src/libs/Db';

describe('Database Connection', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it('should connect successfully', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });
});