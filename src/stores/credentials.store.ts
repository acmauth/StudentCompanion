import { persisted } from 'svelte-persisted-store'

export interface UserCreds {
    username: string;
    password: string;
}

// Store for the user's credentials
export const userCreds = persisted<UserCreds>('usercredentials', {
    username: "",
    password: ""
})

// Store for the user's tokens
interface elearningCreds {
    sesskey: string;
    moodleSession: string;
    userID: string;
}

interface universisCreds {
    token: string;
}

export interface userTokens {
    elearning: elearningCreds;
    universis: universisCreds;
}

export const userTokens = persisted<userTokens>('userTokens', {
    elearning: {
        sesskey: "",
        moodleSession: "",
        userID: ""
    },
    universis: {
        token: ""
    }
})