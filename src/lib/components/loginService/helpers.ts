// import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
import { userCreds, userTokens } from "$stores/credentials.store";
import { elearningFetchNewToken } from "$lib/elearningAuthentication/elearningDataService";
import sisAuthenticator from "$lib/-universis/authenticator/core";
import elearningAuthenticator from "$lib/-elearning/authenticator/core";

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

    } 
    return outputMessage;
}


/**
 * Retrieves the Elearning token for the given username and password.
 * @param username - The username for authentication.
 * @param password - The password for authentication.
 * @returns A message indicating the success or failure of the token retrieval.
 */
export async function getElearningToken(username: string, password: string) {
    try {
        const encodedPassword = encodeURIComponent(password);
        const response = await elearningAuthenticator(username, encodedPassword);

        if (!response.error && response.credentials) {
            return "";
        } else {
            return "Elearning failed!" + response.error + response.credentials;
        }
    } catch (error) {
        return "An error occurred while retrieving the Elearning token.";
    }
}