import axios from 'axios';
import { config } from '../config/config';

const IGDB_AUTH_URL = 'https://id.twitch.tv/oauth2/token';
let accessToken: string | null = null;
let tokenExpiration: number | null = null;

export const getIgdbToken = async (): Promise<string> => {
    if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
        return accessToken;
    }
    try {
        accessToken = null;
        tokenExpiration = null;

        const response = await axios.post(`${IGDB_AUTH_URL}`, {
            client_id: config.igdbClientId,
            client_secret: config.igdbClientSecret,
            grant_type: 'client_credentials',
        });
        accessToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000;
        if (!accessToken || !tokenExpiration) {
            throw new Error('Invalid token response from IGDB');
        }
        return accessToken;
    } catch (error) {
        console.error('Error authenticating with IGDB:', error);
        throw error;
    }
};
