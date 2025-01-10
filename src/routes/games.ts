import { Router, Request, Response } from 'express';
import { fetchGamesFromIgdb } from '../services/igdbService';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const games = await fetchGamesFromIgdb();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

export default router;
