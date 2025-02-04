import { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Application } from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';
import suggestionRoutes from './routes/suggestionRoutes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/suggest', suggestionRoutes);

// Export a single serverless function
export default function handler(req: VercelRequest, res: VercelResponse) {
    return app(req, res);
}
