import { Request, Response } from 'express';
import { getSuggestionsFromOpenAi } from '../services/openAiService';
import { Game } from '../models/Game';
import { checkAllMembers } from '../utils/arrayUtils';

export const getSuggestions = async (req: Request, res: Response) => {
    console.log('Suggestion Request received: ' + new Date(Date.now()));
    const gameArray = req.body.selectedGames;
    // const preferenceArray = req.body.preferences; TODO add this later
    try {
        if (
            !Array.isArray(gameArray) ||
            !checkAllMembers(gameArray, Game.validateGame)
            // !Array.isArray(preferenceArray) ||
            // !checkAllMembers(preferenceArray, Game.validateGame)
        ) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }

        const gameHistory: Game[] = gameArray.map(
            (game: any) => new Game(game),
        );
        const games = await getSuggestionsFromOpenAi(gameHistory);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
};
