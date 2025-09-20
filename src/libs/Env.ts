import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
    // Neon database URL (required)
    DATABASE_URL: z.string(),
    // Local DB config (commented out - using Neon only)
    // DB_NAME: z.string().optional(),
    // DB_USER: z.string().optional(),
    // DB_PASS: z.string().optional(),
    // DB_HOST: z.string().optional(),
    // DB_PORT: z.string().optional(),
    // Redis configuration
    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.string().optional(),
    REDIS_URL: z.string().optional(),
    // Backblaze B2 configuration
    BACKBLAZE_APPLICATION_KEY_ID: z.string().optional(),
    BACKBLAZE_APPLICATION_KEY: z.string().optional(),
    BACKBLAZE_BUCKET_NAME: z.string().optional(),
    BACKBLAZE_BUCKET_ID: z.string().optional(),
    BACKBLAZE_ENDPOINT: z.string().optional(),
});

function validateEnv() {
    // Skip validation during build time to avoid build failures
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
        console.warn("⚠️ Skipping environment validation during Vercel build");
        return;
    }
    
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("❌ Invalid environment variables:", parsed.error.format());
        process.exit(1);
    }
    
    // Ensure we have DATABASE_URL (Neon only)
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is required for Neon database connection");
        process.exit(1);
    }
}

validateEnv();

export const env = {
    // Neon database URL (required)
    DATABASE_URL: process.env.DATABASE_URL,
    // Local DB config (commented out - using Neon only)
    // DB_NAME: process.env.DB_NAME,
    // DB_USER: process.env.DB_USER,
    // DB_PASS: process.env.DB_PASS,
    // DB_HOST: process.env.DB_HOST,
    // DB_PORT: process.env.DB_PORT,
    // Redis configuration
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || '6379',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB || '0',
    REDIS_URL: process.env.REDIS_URL,
    // Backblaze B2 configuration
    BACKBLAZE_APPLICATION_KEY_ID: process.env.BACKBLAZE_APPLICATION_KEY_ID,
    BACKBLAZE_APPLICATION_KEY: process.env.BACKBLAZE_APPLICATION_KEY,
    BACKBLAZE_BUCKET_NAME: process.env.BACKBLAZE_BUCKET_NAME,
    BACKBLAZE_BUCKET_ID: process.env.BACKBLAZE_BUCKET_ID ,
    BACKBLAZE_ENDPOINT: process.env.BACKBLAZE_ENDPOINT,
};


