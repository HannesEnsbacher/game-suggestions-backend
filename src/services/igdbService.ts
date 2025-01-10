import axios from 'axios';
import { config } from '../config/config';
import { getIgdbToken } from './igdbTokenService';

const IGDB_BASE_URL = 'https://api.igdb.com/v4';

export const fetchGamesFromIgdb = async () => {
    try {
        // noinspection JSAnnotator
        const response = await axios.post(
            `${IGDB_BASE_URL}/games`,
            'fields id,genres,keywords,name,player_perspectives,cover,first_release_date,game_modes,total_rating,platforms; ' +
                'where category = 0 & cover != null & total_rating_count > 50 & platforms = (3, 6, 7, 9 ,11, 14, 48, 49, 130, 167, 169); ' + // Platforms are Linux, PC, PS, PS3, Xbox, Mac, PS4, Xbox One, Switch, PS5, Xbox Series X in that order
                'sort total_rating desc; limit 10;',
            {
                headers: {
                    'Client-ID': config.igdbClientId,
                    Authorization: `Bearer ${await getIgdbToken()}`,
                },
            },
        );
        console.log(response.data);
        return response.data.results;
    } catch (error) {
        if (error.response) {
            console.error('Error fetching games:', error.response.data);
        } else {
            console.error('Error fetching games:', error);
        }
        throw error;
    }
};
