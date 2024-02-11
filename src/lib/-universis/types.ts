
export type AuthenticationResult {
    error: null;
    token: string;
} | {
    error: string;
    token?: never;
};