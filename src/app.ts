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

export default app;
