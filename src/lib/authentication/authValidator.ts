import { userCreds, userTokens } from "$stores/credentials.store";

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    localStorage.clear();
}

// TODO: Implement a proper login check
export async function getLoginStatus() : Promise<boolean> {
    return false;
}