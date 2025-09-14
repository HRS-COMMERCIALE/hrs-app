import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    // Redis configuration
    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.string().optional(),
    REDIS_URL: z.string().optional(),
});

function validateEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("❌ Invalid environment variables:", parsed.error.format());
        process.exit(1);
    }
}

validateEnv();

export const env = {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    // Redis configuration
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || '6379',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB || '0',
    REDIS_URL: process.env.REDIS_URL,
};


