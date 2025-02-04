import { Intensity } from './intensity';

export class Game {
    id: number;
    name: string;
    cover: string;
    first_release_date: Date;
    keywords: string[];
    platforms: string[];
    description?: string;
    intensity?: Intensity;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.cover = data.cover;
        this.first_release_date = data.first_release_date;
        this.keywords = data.keywords;
        this.platforms = data.platforms;
        this.description = data.description;
        this.intensity = data.intensity;
    }

    static validateGame(game: any): boolean {
        return (
            typeof game.id === 'number' &&
            typeof game.name === 'string' &&
            typeof game.cover === 'string' &&
            typeof game.first_release_date === 'string' &&
            Array.isArray(game.keywords) &&
            Array.isArray(game.platforms)
        );
    }
}
