import { Sequelize } from 'sequelize-typescript';
import { env } from './Env';

const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = env;

export const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASS!, {
  host: DB_HOST!,
  port: Number(DB_PORT),
  dialect: 'postgres',
  models: [], // Add your models here later
  logging: console.log, // Set to true for SQL query logging
});
