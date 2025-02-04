import axios from 'axios';

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
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
            client_id: IGDB_CLIENT_ID,
            client_secret: IGDB_CLIENT_SECRET,
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
