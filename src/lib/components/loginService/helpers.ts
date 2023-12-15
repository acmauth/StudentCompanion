import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
import { userCreds, userTokens } from "$stores/credentials.store";
import userInfoStore from "$stores/userinfo.store";
import { goto } from '$app/navigation';
import { elearningFetchNewToken } from "$lib/elearningAuthentication/elearningDataService";


export async function getUniversisToken(username: string, password: string) {
    console.log("U1");
    
    const encodedPassword = encodeURIComponent(password);
    let outputMessage = "";
    console.log("U2");
    
    const response = await tokenGrab(username, encodedPassword);
    console.log("C");
    
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
            newTokens.universis.token = response.token;
            console.log(response);
            return newTokens;
        });

        outputMessage = outputMessage + "Universis!"
    } 
    return outputMessage;
}

export async function getElearningToken(username: string, password: string) {

    console.log("E1");
    
    const encodedPassword = encodeURIComponent(password);
    let outputMessage = "";
    const response = await elearningFetchNewToken(username, encodedPassword);
    console.log("E2");
    
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