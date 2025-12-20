import { userCreds, userTokens, useAlternativeLogin } from "$stores/credentials.store";
import { get } from "svelte/store";
import reauthenticate from "../-universis/authenticator-deprecated/reauthenticate.js";
import { Network } from '@capacitor/network';
import { Preferences } from "@capacitor/preferences";
import Dexie from "dexie";
import OIDCClient from "./OIDCClient.js";
import { Capacitor } from "@capacitor/core";
import Config from "$src/app.config";

const isMobile = Capacitor.isNativePlatform();
const authClient = new OIDCClient(Config.auth);

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    localStorage.clear();
    Preferences.clear();
    Dexie.delete('cachedData');
}

export async function judgeAuth() {
    /*
    Bool    - Give a judgement on wether the user should be directed to the login page or not
    true:   - The user is logged in
            - The user is offline and has a token
    false:  - The user is not logged in
            - The user is offline and does not have a token
    */
    const onLineStatus = (await Network.getStatus()).connected;

    if (!get(useAlternativeLogin)){
        return authClient.isAuthenticated();
    } else {
        const userCredsValue = get(userCreds);
        if (!userCredsValue.username || !userCredsValue.password) return false;  // If we don't have any credentials, we're not logged in
        if (!onLineStatus) return true;                                          // If we're offline, there is no way to check if we're logged in, so we assume we are and use cached data
        return await getLoginStatus();
    };
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