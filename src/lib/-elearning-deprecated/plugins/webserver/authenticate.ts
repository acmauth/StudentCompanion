import type { AuthenticationResult } from "$lib/-elearning/types";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    let encodedUsername = encodeURIComponent(username);
    let encodedPassword = encodeURIComponent(password);
    const tokenGrab = await fetch("/_elearningService?username="+encodedUsername+"&password="+encodedPassword, {
        method: "GET"
    });
    const response = await tokenGrab.json();
    return response;
}