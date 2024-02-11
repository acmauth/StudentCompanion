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
const isNative = Capacitor.isNativePlatform();


export default async function sisAuthenticator(username: string, password: string) {
    if (isNative) {
        return await nativeAuthenticate(username, password);
    } else {
        return await webAuthenticate(username, password);
    }
}