import { Game } from '../../models/Game';
import { convertUnixToDate } from '../../utils/dateUtils';
import { capitalizeTitle } from '../../utils/stringUtils';

export const igdbGameToGame = (igdbGame: any): Game => {
    return {
        id: igdbGame['id'],
        name: igdbGame['name'],
        cover: igdbGame['cover']
            ? assembleCoverUrl(igdbGame['cover']['image_id'])
            : 'DUMMY IMAGE', // TODO find or make a dummy image
        first_release_date: convertUnixToDate(igdbGame['first_release_date']),
        keywords: assembleKeywords(
            igdbGame['genres'],
            igdbGame['game_modes'],
            igdbGame['player_perspectives'],
            igdbGame['keywords'],
            igdbGame['themes'],
        ),
        platforms: igdbGame['platforms']
            ? igdbGame['platforms'].map((platform: any) => platform['name'])
            : [],
        description: igdbGame['summary']
            ? igdbGame['summary']
            : 'No description available.',
    };
};

export const igdbGamesToGames = (igdbGames: any[]): Game[] => {
    return igdbGames.map((igdbGame) => igdbGameToGame(igdbGame));
};

const assembleKeywords = (
    genres: any[],
    game_modes: any[],
    player_perspectives: any[],
    keywords: any[],
    themes: any[],
): string[] => {
    let keywordNames: string[] = [];

    if (genres) {
        keywordNames = keywordNames.concat(
            getFirst15Elements(genres).map((genre) => genre['name']),
        );
    }
    if (game_modes) {
        keywordNames = keywordNames.concat(
            getFirst15Elements(game_modes).map(
                (game_mode) => game_mode['name'],
            ),
        );
    }
    if (player_perspectives) {
        keywordNames = keywordNames.concat(
            getFirst15Elements(player_perspectives).map(
                (player_perspective) => player_perspective['name'],
            ),
        );
    }
    if (keywords) {
        keywordNames = keywordNames.concat(
            getFirst15Elements(keywords).map((keyword) =>
                capitalizeTitle(keyword['name']),
            ),
        );
    }
    if (themes) {
        keywordNames = keywordNames.concat(
            getFirst15Elements(themes).map((theme) => theme['name']),
        );
    }

    return keywordNames;
};

function getFirst15Elements<T>(array: T[]): T[] {
    return array.slice(0, 15);
}

const assembleCoverUrl = (imageId: string): string => {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
};
