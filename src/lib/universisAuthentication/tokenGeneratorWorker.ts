import authenticate from "./scraper/sisAuthenticator";
import { UniversisAuthenticate } from "./scraper/nativeScraper";
const isProduction = process.env.NODE_ENV === 'production';

export async function tokenGrab(username: string, password: string){
    if (!isProduction) {
        const tokenGrab = await fetch("/loginService?username="+username+"&password="+password, {
            method: "GET"
        });
        const response = await tokenGrab.json();
        return response;
    } else {
        console.log("B1");
        // const tokenGrab = await authenticate(username, password);
        const tokenGrab = await UniversisAuthenticate.authenticate({username: username, password: password});
        return tokenGrab;
    }

}