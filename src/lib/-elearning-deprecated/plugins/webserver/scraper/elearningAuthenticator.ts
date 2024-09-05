/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';
import fetch from 'cross-fetch';
import makeFetchCookie from 'fetch-cookie'
import type { AuthenticationResult } from '$lib/-elearning/types';


export default async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
  
    
    // Creating an axios session
    const jar = new CookieJar();
    // axios.defaults.withCredentials = true
    // const session = wrapper(axios.create({ jar }));
    const sessionFetch = makeFetchCookie(fetch, jar);
  
    // Setting the parameters
    const initialUrl = "https://elearning.auth.gr/auth/saml/index.php?wantsurl=https://elearning.auth.gr/";

    // Step 1: Initial GET request
    // const response1 = await session.get(initialUrl, {withCredentials: true});
    const response1 = await sessionFetch(initialUrl, {method: 'GET'});
    console.log("Step1: " + response1.status);
    console.log(await response1.text());
    
    // const resp_url1 = response1.request.res.responseUrl;
    const resp_url1 = response1.url;

    const auth_state1 = resp_url1.split("?AuthState=")[1];
    const post_url1 = resp_url1.split("?AuthState=")[0];
    const authStateDecoded = decodeURIComponent(auth_state1);
    
    // Step 2: POST Auth state and credentials
    const form_data2 = {
        'username': username,
        'password': password,
        'AuthState': authStateDecoded,
    }
    
    // Important: The content-type header must be set to application/x-www-form-urlencoded, otherwise the request will fail
    // const response2 = await session.post(post_url1, form_data2, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'}});
    const response2 = await sessionFetch(post_url1, {method: 'POST', body:  new URLSearchParams(form_data2), headers: {'content-type': 'application/x-www-form-urlencoded'}});
    

    const response_page2 = cheerio.load(await response2.text());
    
    const form2_url = response_page2('form').attr('action');
    const saml_response = response_page2('input[name="SAMLResponse"]').attr('value');
    const relay_state = response_page2('input[name="RelayState"]').attr('value');
    
    // Step 3: POST SAMLResponse and RelayState
    const form_data3 = {
        "SAMLResponse": saml_response,
        "RelayState": relay_state,
    }

    if (!form2_url) {
            return {error: "Step2: form2_url is undefined"};
    }

    const { SAMLResponse, RelayState } = form_data3;
    const updatedFormData = {
        SAMLResponse: SAMLResponse || '',
        RelayState: RelayState || '',
    };

    // const response3 = await session.post(form2_url, updatedFormData, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'}});
    const response3 = await sessionFetch(form2_url, {method: 'POST', body:  new URLSearchParams(updatedFormData), headers: {'content-type': 'application/x-www-form-urlencoded'}});
    // const response_page3 = cheerio.load(response3.data);
    const response_page3 = cheerio.load(await response3.text());

    // Step 4, parsing the returned data
    
    let sesskey: string = "";
    let moodleSession: string= "";
    let userID: string = "";

    // Scraping the session key!
    const scripts = response_page3('script:contains("M.cfg")');

    if (scripts.length > 0) {
        const firstScriptWithMcfg = scripts.first();
        const scriptContent = firstScriptWithMcfg.html();
        if (scriptContent) {
            const cfg = JSON.parse(scriptContent.split("M.cfg = ")[1].split(";")[0]);
            sesskey = cfg["sesskey"];
        } else {
            return {error: "Step4: Script content is null or undefined"};
        }
    } else {
        return {error: "Step4: No script tags found containing 'M.cfg'"};
    }

    
    // Scraping the user ID!
    const elementsWithDataUserId = response_page3('[data-user-id]');

    // Iterate through the selected elements and return the content of the first non-empty attribute
    for (let i = 0; i < elementsWithDataUserId.length; i++) {
      const element = elementsWithDataUserId[i];
      let userid = response_page3(element).attr('data-user-id');
        
      if (userid && userid.trim() !== '') {
        userID =  userid;
      }
    } 
    if (!userID) {
        return {error: "Step4: userID is undefined"};
    }

    // Scraping the MoodleSession cookie!
    const elearningCookies = await jar.getCookies("https://elearning.auth.gr");
    elearningCookies.forEach(cookie => {
        if (cookie.key === "MoodleSession") {
            moodleSession = cookie.value;
        }
    });

    const elearningCredentials = {
        sesskey: sesskey,
        moodleSession: moodleSession,
        userID: userID,
    }

    console.log("Elearning login successful!");
    // console.log(elearningCredentials);
    
    return {error: null, credentials: elearningCredentials};
  }
  
  