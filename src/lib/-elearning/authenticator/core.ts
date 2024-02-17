/**
 * Authenticates the user with the provided username and password.
 * If running on a native platform, it uses the native authentication method.
 * Otherwise, it uses the web authentication method.
 * 
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves with the authentication result.
 */
import { Capacitor } from "@capacitor/core";
import {authenticate as webAuthenticate} from "../plugins/webserver/authenticate";
import { authenticate as nativeAuthenticate } from "../plugins/native/authenticate";
import type { AuthenticationResult, ElearningCredentials } from "$lib/-elearning/types";
import { userTokens } from "$stores/credentials.store";
const isNative = Capacitor.isNativePlatform();


export default async function elearningAuthenticator(username: string, password: string) {
    let authenticationResult: AuthenticationResult;

    if (isNative) {
        authenticationResult = await nativeAuthenticate(username, password);
    } else {
        authenticationResult =  await webAuthenticate(username, password);
    }

    if (!authenticationResult.error) {
        userTokens.update((newTokens) => {
            newTokens.elearning.moodleSession = (authenticationResult.credentials as ElearningCredentials).moodleSession;
            newTokens.elearning.sesskey = (authenticationResult.credentials as ElearningCredentials).sesskey;
            newTokens.elearning.userID = (authenticationResult.credentials as ElearningCredentials).userID;
            return newTokens;
          });
    }

    return authenticationResult;
}