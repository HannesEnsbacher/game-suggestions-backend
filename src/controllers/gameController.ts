import { Request, Response } from 'express';
import { searchGamesFromIgdb } from '../services/igdbApiServices/igdbService';
import topGamesData from '../data/topGamesData';

export const searchGames = async (req: Request, res: Response) => {
    try {
        const searchString = req.query.term as string;
        const games = await searchGamesFromIgdb(searchString);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};

export const getTopGames = async (req: Request, res: Response) => {
    try {
        const games = topGamesData;
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};
