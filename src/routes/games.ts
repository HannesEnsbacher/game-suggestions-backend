import { Router, Request, Response } from 'express';
import { fetchPopularGames } from '../services/apiService';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const games = await fetchPopularGames();
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

export default router;
