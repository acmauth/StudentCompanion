import { registerPlugin } from '@capacitor/core';

export interface ElearningAuthenticatePlugin {
    authenticate(options: { username: string, password: string }): Promise<{
        error: string;
        token?: undefined;
    } | {
        error: null;
        credentials: {
            sesskey: string;
            moodleSession: string;
            userID: string;
        };
    }>;
}

export const ElearningAuthenticate = registerPlugin<ElearningAuthenticatePlugin>('ElearningScraper');