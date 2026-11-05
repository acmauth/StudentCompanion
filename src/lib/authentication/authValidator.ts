import { userCreds, userTokens } from "$stores/credentials.store";
import { loginStore } from '$lib/authentication/loginStore';
import type { LoginTokens } from '$lib/authentication/loginStore';
import { get } from "svelte/store";
import reauthenticate from "../-universis/authenticator-deprecated/reauthenticate.js";
import { Network } from '@capacitor/network';
import OIDCClient from "./OIDCClient.js";
import { Capacitor } from "@capacitor/core";
import Config from "$src/app.config";
import { AuthExpiredError } from "$lib/errors";



const isMobile = Capacitor.isNativePlatform();
const authClient = new OIDCClient(Config.auth);



export async function judgeAuth(): Promise<boolean> {
    /*
    Decides whether startup should continue into the app or go to login.
    Refreshes an expired access token here, so later requests don't hit
    an expired session halfway through rendering.

    true:   - The user is offline (cached data carries the session)
            - The session is valid or was refreshed
            - The refresh failed for a reason other than expiry (network, 5xx)
    false:  - There is no session
            - The server rejected the refresh token
    */
    const onLineStatus = (await Network.getStatus()).connected;
    if (!onLineStatus) return true;

    if (!authClient.isAuthenticated()) return false;
    if (!authClient.isExpired()) return true;

    try {
        await authClient.refreshToken();
        return true;
    } catch (error) {
        if (error instanceof AuthExpiredError) {
            authClient.clearTokens();
            return false;
        }
        console.warn('[judgeAuth] Token refresh failed, continuing with cached data:', error);
        return true;
    }
}


export async function getLoginStatus() : Promise<boolean> {
    // Checking for our login status by doing a dummy request to the server
    // If we get a 200, we're logged in
    // if we get a 40x, we're not logged in

    // We perform a request to the server to check if we're logged in
    // If successful, we return true
    // If not, out token might just be invalid, so we try to reauthenticate
    // If we're still not logged in, we return false
    try {
        let _userTokens: any = get(userTokens);
    
        // We get the token from the store
        const url = `${Config.universis.api}/users/me`;
        const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${_userTokens.universis.token}`,
        },
        });

        if (response.status >= 500 || response.status === 200) {
            return true;
        }
        else {
            for(let i = 0; i < 3; i++){
                await reauthenticate();
                _userTokens = get(userTokens);
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${_userTokens.universis.token}`,
                    },
                });
                if (response.status >= 500 || response.status === 200) {
                    return true;
                }
                await new Promise(r => setTimeout(r, 1000)); 
            }
            return false;
        }
    }
    catch (e) {
        return false;
    }
}