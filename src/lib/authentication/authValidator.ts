import { userCreds, userTokens } from "$stores/credentials.store";
import userInfoStore from "$stores/userinfo.store";

// Do we wanna log out? Let's clear our path
export function invalidateAuth(){
    userCreds.set({
        username: "",
        password: ""
    });

    userTokens.set({
        elearning: {
            sesskey: "",
            moodleSession: ""
        },
        universis: {
            token: ""
        }
    });

    userInfoStore.set({
        userId: "",
        valid: false
    });
}