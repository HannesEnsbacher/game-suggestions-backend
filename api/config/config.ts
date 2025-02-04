import dotenv from 'dotenv';
dotenv.config();

// Ensure required variables are present
const requiredEnvVars = [
    'IGDB_CLIENT_ID',
    'IGDB_CLIENT_SECRET',
    'OPENAI_API_KEY',
] as const;

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

// Type-safe access to environment variables
export const config = {
    igdbClientId: process.env.IGDB_CLIENT_ID!,
    igdbClientSecret: process.env.IGDB_CLIENT_SECRET!,
    openAiApiKey: process.env.OPENAI_API_KEY!,
};
