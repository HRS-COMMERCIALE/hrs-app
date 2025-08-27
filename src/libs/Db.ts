import { Sequelize } from 'sequelize-typescript';
import { env } from './Env';

const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = env;

// Create a function to get the database connection instead of creating it at import time
let sequelizeInstance: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(DB_NAME!, DB_USER!, DB_PASS!, {
      host: DB_HOST!,
      port: Number(DB_PORT),
      dialect: 'postgres',
      models: [], // Add your models here later
      logging: console.log, // Set to true for SQL query logging
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
  return sequelizeInstance;
}

// For backward compatibility, export the instance getter
export const sequelize = getSequelize();