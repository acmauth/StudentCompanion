import { registerPlugin } from '@capacitor/core';

export interface UniversisAuthenticatePlugin {
    authenticate(options: { username: string, password: string }): Promise<{
        error: string;
        token?: undefined;
    } | {
        error: null;
        token: any;
    }>;
}

export const UniversisAuthenticate = registerPlugin<UniversisAuthenticatePlugin>('UniversisScraper')
