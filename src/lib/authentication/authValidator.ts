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
    // const keyCloakStoreValue = get(keyCloakStore);
    const keyCloakStoreValue = {token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtZ2pDcTZCeU83ZktNMUdxZ3JISHNSVU56WmhXZEI4RmtXZXZFVWRORjZNIn0.eyJleHAiOjE3Mjc1MzY1MjUsImlhdCI6MTcyNzUzMjkyNSwiYXV0aF90aW1lIjoxNzI3NTMwMTgyLCJqdGkiOiIwYWYyNWUxNi1kNmE5LTQ1ZjQtYjQwMi1kMTY3YjFmNDFiMWQiLCJpc3MiOiJodHRwczovL29hdXRoMi5pdC5hdXRoLmdyL2F1dGgvcmVhbG1zL3VuaXZlcnNpcyIsInN1YiI6IjZkODQxMzdkLTAwYTAtNDUwYi1iZmQ5LTJjMGE4MzBiMGYyYiIsInR5cCI6IkJlYXJlciIsImF6cCI6InN0dWRlbnRzIiwic2Vzc2lvbl9zdGF0ZSI6IjNhNGNmMDkzLTRmODAtNGQ1Zi05ZTEzLWNlMTk2YjRkN2IwZSIsImFjciI6IjAiLCJzY29wZSI6InN0dWRlbnRzIiwic2lkIjoiM2E0Y2YwOTMtNGY4MC00ZDVmLTllMTMtY2UxOTZiNGQ3YjBlIiwidXNlcklkZW50aWZpZXIiOiIxMTE4MDQwOTA5MTMwNDg5IiwiYWZmaWxpYXRpb24iOiJzdHVkZW50IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibmVyb25ta3AiLCJlbWFpbCI6Im5lcm9ubWtwQGNzZC5hdXRoLmdyIn0.ci_zqlTdn-GDAz4Ha57_xY1e6XUplrcRLJ2Vu4vda86nPUjrrt7wAOn4LFdyFmNnbacTyoBK5UqlgWe7XV3vjhKACuhsLIuQTqsExdOrmS5ShV1CGu76mmEGSXuPqlI7SrBhLCNDG8Lu3GruKcPnTMyBAwjmbRI6GyRwRrX95XEAZZ0tC90CsS38cu_J3rIzkoqDx163GljQ5E9RNQqfeDN-XaizPQ8_Cr0-cudCBhZtA_n6sZQEEp8mF54HzwurvwFr4-hD70FgKfJXpvEuvSnDPbeHxcTqhx_On5FlRtcYSnbmt32Qv7OVye8nmzXNAjyFf6Vjgj0Zu0rKJAXZog"};
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