import { universisGet } from "$lib/dataService";
import { userCreds } from "./authStore";
import { get } from "svelte/store";
import { tokenGrab } from "./tokenGeneratorWorker";

// Let's check if we have a valid token. If not, let's see if we can create one with our username and password.
export async function validateAuth(): Promise<boolean>{
    try {
        // Checks with the current token if it's valid
        const res = await universisGet("users/me");
        if (res.statusCode != 200){
            throw Error("Authentication issue!")
        }
    }
    catch (Error){
        console.log("Invalid universis token, generating new one...");
        // Our token is invalid! This is an outrage, we gotta fix it!
        const creds = get(userCreds);

        // Let's try getting a new one with our saved username and password
        const response = await tokenGrab(creds.username, creds.password);
        
        // Did it work?
        if (response.error){
            // Nopeee, someone didn't set their username and password!
            console.log("Invalid username or password");
            return false
        }
        else {
            // Of course it worked! We got a brand new token now! Best birthday present!
            console.log("New universis token generated!")
            creds.token = response.token;
            userCreds.set(creds)
            return true
        }
        return false
    }
    return true;
}

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    userCreds.set({
        username: "",
        password: "",
        token: ""
    })
}