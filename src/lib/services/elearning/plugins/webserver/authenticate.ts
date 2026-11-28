import type { AuthenticationResult } from "$services/elearning/types";

export async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
    let encodedUsername = encodeURIComponent(username);
    let encodedPassword = encodeURIComponent(password);
    const tokenGrab = await fetch("/webserver/elearning?username="+encodedUsername+"&password="+encodedPassword, {
        method: "GET"
    });
    const response = await tokenGrab.json();
    return response;
}