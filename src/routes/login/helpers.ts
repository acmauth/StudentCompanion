// import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
import { userCreds, userTokens } from "$stores/credentials.store";
import userInfoStore from "$stores/userinfo.store";
import { elearningFetchNewToken } from "$lib/elearningAuthentication/elearningDataService";
import sisAuthenticator from "$lib/-universis/authenticator/core";

/**
 * Retrieves the Universis token for the given username and password.
 * @param username - The username for authentication.
 * @param password - The password for authentication.
 * @returns A message indicating the success or failure of the token retrieval.
 */
export async function getUniversisToken(username: string, password: string) {
    const encodedPassword = encodeURIComponent(password);
    let outputMessage = "";
    const response = await sisAuthenticator(username, encodedPassword);
    
    if (response.error){
        outputMessage = response.error;
        outputMessage = outputMessage + "Universis failed!"
    }
    else {
        userCreds.set({
            username: username,
            password: password
        });
        
        userTokens.update((newTokens) => {
            newTokens.universis.token = response.token as string;
            return newTokens;
        });

        outputMessage = outputMessage + "Universis!"
    } 
    return outputMessage;
}


/**
 * Retrieves the Universis token for the given username and password.
 * @param username - The username for authentication.
 * @param password - The password for authentication.
 * @returns A message indicating the success or failure of the token retrieval.
 */
export async function getElearningToken(username: string, password: string) {
    const encodedPassword = encodeURIComponent(password);
    let outputMessage = "";
    const response = await elearningFetchNewToken(username, encodedPassword);
    if (!response.error && response.credentials){
    userTokens.update((newTokens) => {
        newTokens.elearning.moodleSession = response.credentials.moodleSession;
        newTokens.elearning.sesskey = response.credentials.sesskey;
        return newTokens;
    });
    userInfoStore.update((newUserInfo) => {
        newUserInfo.userId = response.credentials.userID;
        newUserInfo.valid = true;
        return newUserInfo;
    });
    outputMessage = outputMessage + "Elearning!"
    } else {
        outputMessage = outputMessage + "Elearning failed!"
    }
    return outputMessage;
}