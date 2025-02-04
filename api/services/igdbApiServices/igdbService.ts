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
const IGDB_PLATFORMS = '(3, 6, 7, 9 ,11, 14, 48, 49, 130, 167, 169)'; // Platforms are Linux, PC, PS, PS3, Xbox, Mac, PS4, Xbox One, Switch, PS5, Xbox Series X in that order

const gameCache = GameCache.getInstance(); // TODO Think through if the cache is actually useful with how the user can interact in the frontend. Currently the only thing i can think could make sense is caching certain searchstrings and their results but that could unnecessarily bloat the cache

export const searchGamesFromIgdb = async (
    searchString: string,
): Promise<Game[]> => {
    console.log('Searching for games with search string: ' + searchString);
    try {
        // noinspection JSAnnotator
        const response = await axios.post(
            `${IGDB_BASE_URL}/games`,
            `fields ${IGDB_FIELDS}; ` + // TODO Decide if i am going to use the search fields or the normal fields (try with normal fields first and if it is too slow switch to search fields and change implementation accordingly)
                `where category = 0 & version_parent = null & platforms = ${IGDB_PLATFORMS} & ${buildNameSearchQuery(searchString)}; ` +
                'limit 6; sort total_rating_count desc;',
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
        if (error instanceof Error) {
            if (error.message) {
                console.error('Error fetching games:', error.message);
            } else {
                console.error('Error fetching games:', error);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
        throw error;
    }
};

export const searchSuggestionsFromIgdb = async (
    suggestions: any[],
): Promise<Game[]> => {
    console.log('Searching for suggested games: ' + suggestions);
    try {
        // noinspection JSAnnotator
        const response = await axios.post(
            `${IGDB_BASE_URL}/games`,
            `fields ${IGDB_FIELDS}; ` +
                `where category = 0 & version_parent = null & platforms = ${IGDB_PLATFORMS} & ${buildMultiGameSearchQuery(suggestions)}; ` +
                'sort total_rating_count desc; limit 9;',
            {
                headers: {
                    'Client-ID': config.igdbClientId,
                    Authorization: `Bearer ${await getIgdbToken()}`,
                },
            },
        );
        const games: Game[] = igdbGamesToGames(response.data);
        return games;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message) {
                console.error('Error fetching games:', error.message);
            } else {
                console.error('General Error fetching games:', error);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
        throw error;
    }
};

// TODO add a service to get the keywords and genres from the igdb api

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
        if (error instanceof Error) {
            if (error.message) {
                console.error('Error fetching games:', error.message);
            } else {
                console.error('Error fetching games:', error);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
        throw error;
    }
};

const buildNameSearchQuery = (searchString: string): string => {
    // Preprocess user input
    const sanitizedInput = searchString
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' '); // Remove special characters
    const spaceSanitizedInput = sanitizedInput.replace(/\s+/g, ' '); // Remove multiple spaces
    const terms = spaceSanitizedInput.split(' '); // Split on spaces

    // Build query parts
    const queryParts = terms.map((term) => `name ~ *"${term}"*`);
    const fullPartQuery = queryParts.join(' & '); // Combine with AND

    return `(name ~ *"${searchString}"* | (${fullPartQuery}))`;
};

const buildSuggestionNameSearchQuery = (searchString: string): string => {
    return `(name ~ "${searchString}")`;
};

const buildMultiGameSearchQuery = (suggestions: any[]): string => {
    return (
        '(' +
        suggestions
            .map(
                (suggestion) => buildSuggestionNameSearchQuery(suggestion.name),
                // '& ' +
                // buildYearSearchQuery(suggestion.release_year),
            )
            .join(' | ') +
        ')'
    );
};

const buildYearSearchQuery = (year: number): string => {
    return `(first_release_date >= ${getYearStartUnixDate(year)} & first_release_date <= ${getYearEndUnixDate(year)})`;
};

const getYearEndUnixDate = (year: number): number => {
    return Math.floor(new Date(year, 12, 31).getTime() / 1000);
};

const getYearStartUnixDate = (year: number): number => {
    return Math.floor(new Date(year, 1, 1).getTime() / 1000);
};
