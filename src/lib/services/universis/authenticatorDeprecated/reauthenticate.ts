import { get } from "svelte/store";
import { userCreds } from "$services/authentication/credentialsStore";
import sisAuthenticator from "./core";

export default async function reauthenticate() {
    // If the token is invalid, we try to get a new one
    await sisAuthenticator(get(userCreds).username, get(userCreds).password);
}