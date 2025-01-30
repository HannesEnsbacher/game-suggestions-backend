import { Game } from '../models/Game';

import OpenAI from 'openai';
import { searchSuggestionsFromIgdb } from './igdbApiServices/igdbService';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT =
    'Provide well-thought out video game suggestions based on the gaming history of a user. ' +
    'You will receive a list of games that the user has played, including the names, how much the user liked them in the form of a value called intensity, and a list of keywords related to each game. ' +
    'Based on this information, analyze the game history for similarities and patterns to suggest games that align with these preferences and interests.\n\n' +
    'Focus on suggesting games with a strong active player base and popularity based on engagement rather than reviews or ratings. ' +
    'Consider both newer and older games regardless of release hype, keeping the active player base and play frequency as the primary metrics for suggestion quality. ' +
    'For at least 2 of the suggestions you should consider games with a smaller, but still active, community.' +
    'Your suggestions can not include any of the games that are provided to you in the list.' +
    '\n\n# Steps' +
    "\n\n1. **Analyze User's Gaming History:**\n   " +
    '- Examine the list of games the user has played, paying attention to how much the user liked each game.\n   ' +
    '- Identify common themes, genres, art styles, game modes, perspectives, and other keywords.\n\n' +
    '2. **Patterns & Preferences:**\n   ' +
    "- Determine patterns or trends in the user's preferences based on their gaming history.\n   " +
    '- Consider the popularity and active player base of games with similar characteristics.\n\n' +
    '3. **Generate Suggestions:**\n   ' +
    '- Select games that align with identified patterns and preferences.\n   ' +
    '- Ensure these games have a strong active player base and are popular among players.\n\n' +
    '4. **Provide Results:**\n   ' +
    "- For each of the 6 game suggestions, include the game name and release year considering the user's preferences and the game's current popularity.\n\n" +
    '- **Note:** Do not suggest any games that are already on the list of provided games.\n\n' +
    '# Output Format\n\n' +
    'The output should be a JSON object containing six game suggestions, each with the following fields:\n' +
    '- `name`: The name of the suggested game.\n' +
    '- `release_year`: The release year of the suggested game.\n' +
    'Example JSON structure:\n' +
    '```json\n{\n  "suggestions": [\n    {\n      "name": "Game Title 1",\n      "release_year": 2020\n      },\n    {\n      "name": "Game Title 2",\n      "release_year": 2018\n      }\n    // Additional suggestions...\n  ]\n}\n```\n\n' +
    '# Notes\n\n' +
    '- Make sure that you do not include too many similar games in your response. Avoid suggesting different versions of the same game and avoid games that are extremely similar but from a different company.\n' +
    '- Focus on the engagement levels and active players of the suggested games, ensuring they are well-regarded in the gaming community for these metrics.\n' +
    '- Do not suggest any expansion or alternate versions to games that were already played. Only include main games in your suggestions.\n' +
    '- Do not include games that are already on the list of provided games.';

export const getSuggestionsFromOpenAi = async (
    gameHistory: Game[],
): Promise<Game[]> => {
    console.log('Getting Suggestions for game history: ', gameHistory);
    const messageText = JSON.stringify(
        gameHistory.map((game) => {
            return {
                name: game.name,
                intensity: game.intensity,
                keywords: game.keywords,
            };
        }),
    );

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'text',
                            text: PROMPT,
                        },
                    ],
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: messageText,
                        },
                    ],
                },
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'suggestions_model',
                    schema: {
                        type: 'object',
                        required: ['suggestions'],
                        properties: {
                            suggestions: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    required: ['name', 'release_year'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description:
                                                'The name of the suggestion.',
                                        },
                                        release_year: {
                                            type: 'number',
                                            description:
                                                'The release year of the suggestion.',
                                        },
                                    },
                                    additionalProperties: false,
                                },
                                description: 'A list of suggestions.',
                            },
                        },
                        additionalProperties: false,
                    },
                    strict: true,
                },
            },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const responseContent = response.choices[0].message.content;
        if (!responseContent) {
            let error = new Error('No response content from OpenAI');
            throw error;
        }

        const suggestionsJson = JSON.parse(responseContent);
        console.log('suggestonsJson.suggestions', suggestionsJson.suggestions);
        const suggestions = suggestionsJson.suggestions.map(
            (suggestion: any) => {
                return {
                    name: suggestion.name,
                    release_year: suggestion.release_year,
                };
            },
        );
        console.log('Suggestions from OpenAI:', suggestions);

        return await searchSuggestionsFromIgdb(suggestions);
    } catch (error) {
        if (error.response) {
            console.error('Error fetching games:', error.response.data);
        } else {
            console.error('Error fetching games:', error);
        }
        throw error;
    }
};
