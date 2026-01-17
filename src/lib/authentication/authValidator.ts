import { userCreds, userTokens } from "$stores/credentials.store";
import { get } from "svelte/store";
import { Network } from '@capacitor/network';
import { Preferences } from "@capacitor/preferences";
import Dexie from "dexie";
import OIDCClient from "./OIDCClient.js";
import { Capacitor } from "@capacitor/core";
import Config from "$src/app.config";

const isMobile = Capacitor.isNativePlatform();
const authClient = new OIDCClient(Config.auth);

// Do we wanna log out? Let's clear our path
export function invalidateAuth() {
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

    return authClient.isAuthenticated() || !onLineStatus;
}