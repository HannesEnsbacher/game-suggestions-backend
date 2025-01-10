import { Request, Response } from 'express';
import { fetchGamesFromIgdb } from '../services/igdbApiServices/igdbService';

export const getGames = async (req: Request, res: Response) => {
    try {
        const games = await fetchGamesFromIgdb();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};
