import type { AuthenticationResult } from "$services/elearning/types";
import { ElearningPlugins } from "./nativeDefinitions";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    return ElearningPlugins.authenticate({ username, password});    
}