import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

export interface UserCreds {
    username: string;
    password: string;
}

// Store for the user's credentials
export const userCreds = new CapacitorPersistedStore({
    username: "",
    password: ""
}, 'usercredentials')

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

export const userTokens = new CapacitorPersistedStore({
    elearning: {
        sesskey: "",
        moodleSession: "",
        userID: ""
    },
    universis: {
        token: ""
    }
}, 'userTokens')