import dotenv from 'dotenv';
dotenv.config();

// Ensure required variables are present
const requiredEnvVars = [
    'PORT',
    'IGDB_CLIENT_ID',
    'IGDB_CLIENT_SECRET',
] as const;

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

// Type-safe access to environment variables
export const config = {
    port: Number(process.env.PORT),
    igdbClientId: process.env.IGDB_CLIENT_ID!,
    igdbClientSecret: process.env.IGDB_CLIENT_SECRET!,
};
