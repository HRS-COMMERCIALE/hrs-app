import { Sequelize } from 'sequelize-typescript';
import { neon } from '@neondatabase/serverless';
import { env } from './Env';

const { DATABASE_URL } = env;
// Local DB config (commented out - using Neon only)
// const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = env;

// Create a function to get the database connection instead of creating it at import time
let sequelizeInstance: Sequelize | null = null;
let neonInstance: any = null;

// Get Neon serverless instance
export function getNeon() {
  if (!neonInstance) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured');
    }
    neonInstance = neon(DATABASE_URL);
  }
  return neonInstance;
}

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    if (!DATABASE_URL) {
      // During build time, return a mock instance to prevent build failures
      if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
        console.warn("⚠️ DATABASE_URL not available during build, using mock connection");
        return {} as Sequelize;
      }
      throw new Error('DATABASE_URL is not configured');
    }
    // Use Neon with DATABASE_URL (required)
    sequelizeInstance = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: require('pg'),
      models: [], // Add your models here later
      logging: (sql) => console.log(`[SQL] ${sql}`), // Clean SQL logging
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
    
    // Local DB config (commented out - using Neon only)
    // sequelizeInstance = new Sequelize(DB_NAME!, DB_USER!, DB_PASS!, {
    //   host: DB_HOST!,
    //   port: Number(DB_PORT),
    //   dialect: 'postgres',
    //   models: [], // Add your models here later
    //   logging: (sql) => console.log(`[SQL] ${sql}`), // Clean SQL logging
    //   pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    //   }
    // });
  }
  return sequelizeInstance;
}

// Export the getter function instead of the instance
// This prevents build-time database connection issues
export { getSequelize as sequelize };