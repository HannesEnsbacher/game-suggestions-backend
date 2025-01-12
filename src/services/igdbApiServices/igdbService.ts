import axios from 'axios';
import { config } from '../../config/config';
import { getIgdbToken } from './igdbTokenService';
import { Game } from '../../models/Game';
import { igdbGamesToGames } from './igdbGameMapperService';
import GameCache from '../gameCachingService';

const IGDB_BASE_URL = 'https://api.igdb.com/v4';
const IGDB_FIELDS =
    'id,name,cover.image_id,genres.name,keywords.name,game_modes.name,player_perspectives.name,themes.name,summary,first_release_date,platforms.name';
const IGDB_SEARCH_FIELDS = 'id,name,cover.image_id';
const IGDB_PLATFORMS = '(3, 6, 7, 9 ,11, 14, 48, 49, 130, 167, 169)';

const gameCache = GameCache.getInstance(); // TODO Think through if the cache is actually useful with how the user can interact in the frontend. Currently the only thing i can think could make sense is caching certain searchstrings and their results but that could unnecessarily bloat the cache

export const searchGamesFromIgdb = async (
    searchString: string,
): Promise<Game[]> => {
    try {
        // noinspection JSAnnotator
        const response = await axios.post(
            `${IGDB_BASE_URL}/games`,
            `search "${searchString}"; ` +
                `fields ${IGDB_FIELDS}; ` + // TODO Decide if i am going to use the search fields or the normal fields (try with normal fields first and if it is too slow switch to search fields and change implementation accordingly)
                `where category = 0 & total_rating_count > 10 & platforms = ${IGDB_PLATFORMS}; ` + // Platforms are Linux, PC, PS, PS3, Xbox, Mac, PS4, Xbox One, Switch, PS5, Xbox Series X in that order
                'limit 6;',
            {
                headers: {
                    'Client-ID': config.igdbClientId,
                    Authorization: `Bearer ${await getIgdbToken()}`,
                },
            },
        );
        const games: Game[] = igdbGamesToGames(response.data);
        //gameCache.setMultiple(games); TODO Decide if i am going to use the cache or not
        return games;
    } catch (error) {
        if (error.response) {
            console.error('Error fetching games:', error.response.data);
        } else {
            console.error('Error fetching games:', error);
        }
        throw error;
    }
};

export const fetchTopGamesFromIgdb = async (): Promise<Game[]> => {
    try {
        // noinspection JSAnnotator
        const response = await axios.post(
            `${IGDB_BASE_URL}/games`,
            `fields ${IGDB_FIELDS}; ` +
                `where category = 0 & cover != null & platforms = ${IGDB_PLATFORMS} & id = (121, 1905, 115, 1372, 3212, 126459, 125174, 11198); ` + // Platforms are Linux, PC, PS, PS3, Xbox, Mac, PS4, Xbox One, Switch, PS5, Xbox Series X in that order
                'sort total_rating desc; limit 6;',
            {
                headers: {
                    'Client-ID': config.igdbClientId,
                    Authorization: `Bearer ${await getIgdbToken()}`,
                },
            },
        );
        const games: Game[] = igdbGamesToGames(response.data); // here you have to remove the date convert and add it manually to the results
        console.log(games);
        return games;
    } catch (error) {
        if (error.response) {
            console.error('Error fetching games:', error.response.data);
        } else {
            console.error('Error fetching games:', error);
        }
        throw error;
    }
};
