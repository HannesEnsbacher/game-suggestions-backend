import express, { Application } from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);

export default app;
