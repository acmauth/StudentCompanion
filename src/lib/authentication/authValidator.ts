import { userCreds, userTokens } from "$stores/credentials.store";
import { loginStore } from '$lib/authentication/loginStore';
import type { LoginTokens } from '$lib/authentication/loginStore';
import { get } from "svelte/store";
import reauthenticate from "../-universis/authenticator-deprecated/reauthenticate.js";
import { Network } from '@capacitor/network';
import OIDCClient from "./OIDCClient.js";
import { Capacitor } from "@capacitor/core";
import Config from "$src/app.config";



const isMobile = Capacitor.isNativePlatform();
const authClient = new OIDCClient(Config.auth);



export async function judgeAuth() {
    /*
    Bool    - Give a judgement on wether the user should be directed to the login page or not
    true:   - The user is logged in
            - The user is offline and has a token
    false:  - The user is not logged in
            - The user is offline and does not have a token
    */
    const onLineStatus = (await Network.getStatus()).connected;

    return authClient.isAuthenticated() || !onLineStatus;
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