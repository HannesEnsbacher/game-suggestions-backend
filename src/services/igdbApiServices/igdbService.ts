import axios from 'axios';
import { config } from '../../config/config';
import { getIgdbToken } from './igdbTokenService';
import { Game } from '../../models/Game';
import { igdbGamesToGames } from './igdbGameMapperService';

const IGDB_BASE_URL = 'https://api.igdb.com/v4';

export const fetchGamesFromIgdb = async (): Promise<Game[]> => {
    // Todo rewrite to cache games, also should be duplicated to a search variant with search string and a detail variant with id both should cache in memory
    try {
        // noinspection JSAnnotator
        const response = await axios.post(
            `${IGDB_BASE_URL}/games`,
            'fields id,name,genres.name,keywords.name,game_modes.name,player_perspectives.name,cover.image_id,first_release_date,total_rating,platforms.name; ' +
                'where category = 0 & cover != null & total_rating_count > 50 & platforms = (3, 6, 7, 9 ,11, 14, 48, 49, 130, 167, 169); ' + // Platforms are Linux, PC, PS, PS3, Xbox, Mac, PS4, Xbox One, Switch, PS5, Xbox Series X in that order
                'sort total_rating desc; limit 10;',
            {
                headers: {
                    'Client-ID': config.igdbClientId,
                    Authorization: `Bearer ${await getIgdbToken()}`,
                },
            },
        );
        // Converting the response data to Game objects
        const games: Game[] = await igdbGamesToGames(response.data);

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
