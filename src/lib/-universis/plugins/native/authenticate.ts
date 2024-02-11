import type { AuthenticationResult } from "$lib/-universis/types";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    return {error: null, token: "test"};
}