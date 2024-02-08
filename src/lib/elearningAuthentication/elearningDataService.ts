import { browser } from '$app/environment'; 
import { get } from 'svelte/store';
import { userCreds, userTokens } from '../../stores/credentials.store';
import userInfoStore from '../../stores/userinfo.store';
import elearningAuthenticator from './scraper/elearningAuthenticator';
import { ElearningAuthenticate } from './scraper/nativeScraper';
// import { ElearningFetch } from './nativeFetcher';
import { CapacitorHttp, CapacitorCookies } from '@capacitor/core';
const isProduction = process.env.NODE_ENV === 'production';

export async function elearningFetchNewToken(username: string, password: string){
    console.log("Generating a new elearning token");
    
    return await elearningFetchNewTokenInternal(username, password);

}


export async function elearningFetchNewTokenInternal(username: string, password: string){
    
    
    let response: { error: string; credentials?: undefined; } | { error: null; credentials: { sesskey: string; moodleSession: string; userID: string; }; };
    // If we're running on the browser, we go through this to avoid a CORS error
    if (!isProduction) {
        const newTokenAttempt = await fetch("/elearningService?username="+username+"&password="+password, {
            method: "GET"
        });

        response = await newTokenAttempt.json();
    } else {
        console.log("Running on production-FetchNewToken");
        
        try {
            response = await ElearningAuthenticate.authenticate({username: username, password: password});
            // response = await elearningAuthenticator(username, password);
        }
        catch (err) {
            console.log(err);
            response = { error: err };
        }
        // response = await elearningAuthenticator(username, password);
    }

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
    }
    return response;
}


interface elearningResponseItem {
    error: boolean;
    exception?: { errorcode: string; message: string; } | undefined;
    data?: any | undefined;
}

interface elearningResponse extends Array<elearningResponseItem> {}

export async function internalElearningGet(dataArguments: string, sesskey: string, moodleSession: string): Promise<any>{

    console.log("Running on production-internalElearningGet");
    
    
    const response = await fetch('https://elearning.auth.gr/lib/ajax/service.php?sesskey='+sesskey, {
                method: 'POST',
                body: JSON.stringify(dataArguments),
                headers: {
                    'Cookie': 'MoodleSession='+moodleSession
                },
                credentials: 'include'
    });
    

    const responseRaw: elearningResponse = await response.json();
    
    return responseRaw;

}


export async function elearningGet(dataArguments: any){

    let sesskey = get(userTokens).elearning.sesskey;
    let moodleSession = get(userTokens).elearning.moodleSession;
    let data;

    if (!isProduction){
        const elearningData = await fetch("/elearningService?sesskey="+sesskey+"&moodlesession="+moodleSession, {
            method: "POST",
            body: JSON.stringify({  userArgs: dataArguments,
                                    sesskey: sesskey,
                                    moodleSession: moodleSession})
        });
        data = await elearningData.json();

    } else {
        console.log("Running on production-elearningGet");
        let elearningData;
        try {
            // const elearningData = await internalElearningGet(dataArguments, sesskey, moodleSession);
            elearningData = await ElearningAuthenticate.apiGet({sesskey: sesskey, moodleSession: moodleSession, dataArguments: JSON.stringify(dataArguments)});
            data = elearningData;
        }
        catch (err) {
            console.log(err);
            await elearningFetchNewToken(get(userCreds).username, get(userCreds).password);
            // const elearningData = await internalElearningGet(dataArguments, sesskey, moodleSession);
            elearningData = await ElearningAuthenticate.apiGet({sesskey: sesskey, moodleSession: moodleSession, dataArguments: JSON.stringify(dataArguments)});
            data = elearningData;
        }
        // const elearningData = await internalElearningGet(dataArguments, sesskey, moodleSession);
        data = elearningData;

    }

    if (data.error){
        console.log(data);
        return;
    } else {
        console.log(data);
        data = JSON.parse(data.data);
        console.log(data);
    }

    // Checking if we're logged out
    const responseObject: elearningResponseItem = data[0];

    // Check if we're logged out!
    if (responseObject.error){
        // Check if the error is due to an expired session
        if (responseObject.exception?.errorcode === "invalidsesskey" || responseObject.exception?.errorcode === "servicerequireslogin"){
            // Try to get a new token
            console.log(responseObject.exception?.errorcode);
            await elearningFetchNewToken(get(userCreds).username, get(userCreds).password);
            
            // BUG: Ατέρμονο loop
            return elearningGet(dataArguments);
        }
        return responseObject;
    } else {
        return responseObject;
    }

}