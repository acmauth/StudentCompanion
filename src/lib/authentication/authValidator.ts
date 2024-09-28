import { userCreds, userTokens } from "$stores/credentials.store";
import { get } from "svelte/store";
import reauthenticate from "../-universis/authenticator-deprecated/reauthenticate.js";
import { Network } from '@capacitor/network';
import { Preferences } from "@capacitor/preferences";
import Dexie from "dexie";
import { keyCloakStore, getValidity, getRefreshLife } from '$stores/keycloak.store';

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    localStorage.clear();
    Preferences.clear();
    Dexie.delete('cachedData');
}

export async function judgeAuth() {
    // Give a judgement on wether the user should be directed to the login page or not
    // If the user is logged in, we return true
    // If the user is not logged in, we return false
    // If the user if offline, we return true, unless they don't have a token, in which case we return false

    const onLineStatus = (await Network.getStatus()).connected;
    // const _userCreds: any = get(userCreds);
    
    // if (!_userCreds.password || !_userCreds.username) return false; // If we don't have any credentials, we're not logged in
    // if (!onLineStatus) return true;                                 // If we're offline, there is no way to check if we're logged in, so we assume we are and use cached data
    // return await getLoginStatus();
    keyCloakStore.update((val) => {return {...val, token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtZ2pDcTZCeU83ZktNMUdxZ3JISHNSVU56WmhXZEI4RmtXZXZFVWRORjZNIn0.eyJleHAiOjE3Mjc1MzQxMTgsImlhdCI6MTcyNzUzMDUxOCwiYXV0aF90aW1lIjoxNzI3NTMwMTgyLCJqdGkiOiI5YTQyNWUxNS1lZGNhLTQ4ZjktYWQzYi05MTM4YWNkNGNjZTQiLCJpc3MiOiJodHRwczovL29hdXRoMi5pdC5hdXRoLmdyL2F1dGgvcmVhbG1zL3VuaXZlcnNpcyIsInN1YiI6IjZkODQxMzdkLTAwYTAtNDUwYi1iZmQ5LTJjMGE4MzBiMGYyYiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFyaXN0b21hdGUiLCJub25jZSI6ImIyNzZkMWQ0LWZiMjMtNDkzYy04N2I3LTZjOTgyMmI3MzAxOCIsInNlc3Npb25fc3RhdGUiOiIzYTRjZjA5My00ZjgwLTRkNWYtOWUxMy1jZTE5NmI0ZDdiMGUiLCJhY3IiOiIwIiwic2NvcGUiOiJvcGVuaWQgc3R1ZGVudHM6cmVhZCIsInNpZCI6IjNhNGNmMDkzLTRmODAtNGQ1Zi05ZTEzLWNlMTk2YjRkN2IwZSJ9.CaY23RhAAccQ4eA-baKWdYjrZQg8RFyvHuO0cODDKV5zp9kmZ5r66PErURRzU7tmZPLoY-7Jl4l9-Ce_fXspFaAXLUXyYDRk8NeCJeR7sAilUNjpoBEFyUSjjPA9T2O6QerGZvI7rAqwpXg7_VdrP9UiNDEC1mIt6fShytavopKgfAQdHJDrao35uFCs2iwhRyVD-YQy9r_Vg3Iqm215bm1ihHnmkjml3We3yJv_MCi2WsE-D1xZkzFypfb65dc_tJxdT9S-xCpZ1ADijqnh0ddAuy_by8AwgdlfTNFPyyBHixseNHw0JkC2vEa6OGNRM1oSFFkPlZbNu7ljU6R_Lg"}});
    const keyCloakStoreValue = get(keyCloakStore);
    if (!keyCloakStoreValue.token) return false;
    if (getRefreshLife()) return true;
    return false

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