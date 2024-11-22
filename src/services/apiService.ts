import axios from 'axios';

interface Game {
    name: string;
    genre: string;
    rating: number;
    popularity: number;
}

// export async function fetchPopularGames(): Promise<Game[]> {
export function fetchPopularGames(): string {
    const apiKey = process.env.GAME_API_KEY;
    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

    return apiUrl;
    // const response = await axios.get(apiUrl);
    // return response.data.results.map((game: any) => ({
    //     name: game.name,
    //     genre: game.genres?.[0]?.name || 'Unknown',
    //     rating: game.rating || 0,
    //     popularity: game.added || 0,
    // }));
}
