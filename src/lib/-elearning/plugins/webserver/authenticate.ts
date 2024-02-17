import type { AuthenticationResult } from "$lib/-elearning/types";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    const tokenGrab = await fetch("/_elearningService?username="+username+"&password="+password, {
        method: "GET"
    });
    const response = await tokenGrab.json();
    return response;
}