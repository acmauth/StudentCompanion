import type { AuthenticationResult } from "$lib/-universis/types";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    const tokenGrab = await fetch("/_universisService?username="+username+"&password="+password, {
        method: "GET"
    });
    const response = await tokenGrab.json();
    return response;
}