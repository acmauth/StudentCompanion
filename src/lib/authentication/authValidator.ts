import { userCreds, userTokens } from "$stores/credentials.store";

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    userCreds.set({
        username: "",
        password: ""
    });

    userTokens.set({
        elearning: {
            sesskey: "",
            moodleSession: "",
            userID: ""
        },
        universis: {
            token: ""
        }
    });

}