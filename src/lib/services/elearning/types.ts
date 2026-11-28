export type ElearningCredentials = {
    sesskey: string;
    moodleSession: string;
    userID: string;
};

export type AuthenticationResult = {
        error: null;
        credentials: ElearningCredentials;
    } | {
        error: string;
        credentials?: never;
}

export type ApiRequestResults = {
    error: null;
    data: any;
} | {
    error: string;
    data?: never;
}

export type ElearningRequest = {
    credentials: ElearningCredentials;
    dataArguments: any;
}