import { userCreds, userTokens } from "$stores/credentials.store";
import { get } from "svelte/store";
import reauthenticate from "../-universis/authenticator/reauthenticate.js";
import { Network } from '@capacitor/network';

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    localStorage.clear();
}

export async function judgeAuth() {
    // Give a judgement on wether the user should be directed to the login page or not
    // If the user is logged in, we return true
    // If the user is not logged in, we return false
    // If the user if offline, we return true, unless they don't have a token, in which case we return false

    const onLineStatus = (await Network.getStatus()).connected;
    const _userCreds: any = get(userCreds);
    console.log(_userCreds);
    
    if (!_userCreds.password || !_userCreds.username) return false; // If we don't have any credentials, we're not logged in
    if (!onLineStatus) return true;                                 // If we're offline, there is no way to check if we're logged in, so we assume we are and use cached data
    return await getLoginStatus();

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
        const url = `https://universis-api.it.auth.gr/api/users/me`;
        const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${_userTokens.universis.token}`,
        },
        });

        if (response.status >= 500 || response.status === 200) {
            return true;
        }
        else {
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
            else {
                return false;
            }
        }
    }
    catch (e) {
        return false;
    }
}