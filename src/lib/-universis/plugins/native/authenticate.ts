import type { AuthenticationResult } from "$lib/-universis/types";
import { UniversisAuthenticate } from "./nativeScraper";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    return UniversisAuthenticate.authenticate({ username, password});
}