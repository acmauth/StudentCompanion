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
    apiGet(options: { sesskey: string, moodleSession: string, dataArguments: string }): Promise<{
        error: boolean;
        reason: string;
    } | {
        error: null;
        response: object;
    }>;
}

export const ElearningAuthenticate = registerPlugin<ElearningAuthenticatePlugin>('ElearningScraper');