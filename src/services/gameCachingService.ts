import { Game } from '../models/Game';
import topGamesData from '../data/topGamesData';

class GameCache {
    private cache: Map<number, Game> = new Map();

    private static instance: GameCache; // Hold the singleton instance

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    static getInstance(): GameCache {
        if (!GameCache.instance) {
            GameCache.instance = new GameCache();
            GameCache.instance.initializeCache();
        }
        return GameCache.instance;
    }

    private initializeCache(): void {
        topGamesData.forEach((game: Game) => {
            this.cache.set(game.id, game);
        });
    }

    get(gameId: number): Game | undefined {
        return this.cache.get(gameId);
    }

    set(gameId: number, game: Game): void {
        this.cache.set(gameId, game);
    }

    setMultiple(games: Game[]): void {
        games.forEach((game) => {
            this.cache.set(game.id, game);
        });
    }

    clear(): void {
        this.cache.clear();
    }
}

export default GameCache;
