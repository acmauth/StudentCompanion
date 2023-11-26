
export async function tokenGrab(username: string, password: string){
    const tokenGrab = await fetch("/loginService?username="+username+"&password="+password, {
        method: "GET"
    });

    const response = await tokenGrab.json();
    return response;
}