import dotenv from 'dotenv';
dotenv.config();

// Ensure required variables are present
const requiredEnvVars = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASS',
    'GAME_API_KEY',
] as const;

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

// Type-safe access to environment variables
export const config = {
    port: Number(process.env.PORT),
    dbPort: Number(process.env.DB_PORT),
    dbHost: process.env.DB_HOST!,
    dbUser: process.env.DB_USER!,
    dbPass: process.env.DB_PASS!,
    dbName: process.env.DB_NAME!,
    gameApiKey: process.env.GAME_API_KEY!,
};
