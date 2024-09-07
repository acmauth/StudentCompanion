/**
 * Authenticates a user by performing a series of HTTP requests to an authentication server.
 * 
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns A promise that resolves to an object containing the authentication token or an error message.
 */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'; // Import Axios for HTTP requests
import { PreHeaders } from './preheaders';
import * as cheerio from 'cheerio';
import * as cryptoAUTH from 'crypto';
import * as base64urlAUTH from 'base64url';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import type { AuthenticationResult } from '$lib/-universis/types';

const authorizeURL= "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/auth"
const logoutURL= "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/logout?redirect_uri=https://students.auth.gr/#/auth/login"
const userProfileURL= "https://universis-api.it.auth.gr/api/users/me"
const oauth2= {
        clientID: "students",
        callbackURL: "https://students.auth.gr/auth/callback/index.html",
        tokenURL: "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/token",
        scope: [
          "students"
        ]
}

function generateCodeVerifier(length: number = 64): string {
  const buffer = cryptoAUTH.randomBytes(length);
  return base64urlAUTH.encode(buffer);
}

function generateCodeChallenge(verifier: string): string {
  const hashedVerifier = cryptoAUTH.createHash('sha256').update(verifier).digest();
  return base64urlAUTH.encode(hashedVerifier);
}

function paramsToString(params: object) {
  let parameterString = "?";

  (Object.keys(params) as (keyof typeof params)[]).forEach((key, index) => {
    parameterString = parameterString + "&" + key + "=" + params[key]
  });
  parameterString = parameterString[0] + parameterString.substring(2)
  return parameterString;
}

function stripData(page: cheerio.CheerioAPI, formElements: cheerio.Cheerio<cheerio.Element>, param:string) {
  
  const urls: string[] = [];
  formElements.each((index, element) => {
    const url = page(element).attr(param);
    if (url) {
        urls.push(url);
      }
  });

  if (urls.length > 0) {
      return urls[0];
  } else {
      throw Error("Empty urls list");
  }
}

export default async function authenticate(username: string, password: string): Promise<AuthenticationResult> {
  

  // Creating the code Verifier and code Challenge for authentication
  const state = base64urlAUTH.encode(Math.random().toString(36).substring(2, 10));
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Creating an axios session
  const jar = new CookieJar();
  axios.defaults.withCredentials = true
  const session = wrapper(axios.create({ jar }));

  // Step 1: Initial GET request

  // Setting the parameters
  const initialUrl = authorizeURL;
  let params = {
    redirect_uri: oauth2.callbackURL,
    response_type: 'code',
    client_id: oauth2.clientID,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    scope: oauth2.scope[0],
    state: state,
  };
  
  // Setting the headers
  const step1Headers = PreHeaders.H1();
  
  // Appending the parameters to the url
  let extendedURL = initialUrl + paramsToString(params);

  // performing the request
  const response1 = await session.get(extendedURL, { headers:step1Headers, withCredentials: true, maxRedirects: 5 });
  const response_page = cheerio.load(response1.data);
  
  // Scraping for the form url, SAMLRequest, RelayState
  let formElements = response_page('form[action]');
  const form_url = stripData(response_page, formElements, "action");

  formElements = response_page('input[name="SAMLRequest"]');
  const SAMLRequest = stripData(response_page, formElements, "value");

  formElements = response_page('input[name="RelayState"]');
  const RelayState = stripData(response_page, formElements, "value");
  
  // Step 2: POST SAMLRequest and RelayState
  const form_data = {
    "SAMLRequest": SAMLRequest,
    "RelayState": RelayState,
  }

  const step2Headers = PreHeaders.H2();
  const response2 = await session.post(form_url, form_data, { headers:step2Headers, withCredentials: true});
  
  
  // Step 3: POST username, password, and AuthState
  const form2url = response2.request.res.responseUrl.split("?")[0];
  const response_page2 = cheerio.load(response2.data);
  formElements = response_page2('input[name="AuthState"]');
  const auth_state = stripData(response_page2, formElements, "value");
  
  const form_data3 = {
    "username": username,
    "password": password,
    "AuthState": auth_state,
  }

  const step3Headers = PreHeaders.H3(response2.request.res.responseUrl);
  const response3 = await session.post(form2url, form_data3, { headers:step3Headers, withCredentials: true});
  const response_page3 = cheerio.load(response3.data);
  
  if (response3.data.includes("το όνομα χρήστη ή ο κωδικός πρόσβασης ήταν λάθος")){
    return {error: "Wrong password"};
  };

  formElements = response_page3('form[action]');
  const form_url3 = stripData(response_page3, formElements, "action");
  formElements = response_page3('input[name="SAMLResponse"]');
  const SAMLResponse3 = stripData(response_page3, formElements, "value");
  formElements = response_page3('input[name="RelayState"]');
  const RelayState3 = stripData(response_page3, formElements, "value");

  // Step 4: POST SAMLResponse and RelayState

  const form_data4 = {
    "SAMLResponse": SAMLResponse3,
    "RelayState": RelayState3,
  }
  
  const step4Headers = PreHeaders.H4();
  let responseHeaders = "";
  const response4 = await session.post(form_url3, form_data4, { headers:step4Headers, withCredentials: true, maxRedirects: 0})
  .catch(data => data.response.headers).then(data => responseHeaders = data);
  
  const redirect_url = responseHeaders["location"];
  
  if (!redirect_url.includes("code=")){
    return {error: "the url does not contain a code"}
  }
  
  
  // Step 5: Exchange code for access_token
  const code = redirect_url.split("code=")[1]
  const form_data5 = {
    "grant_type": "authorization_code",
    "code": code,
    "client_id": "students",
    "redirect_uri": "https://students.auth.gr/auth/callback/index.html",
    "code_verifier": codeVerifier,
    }

    const step5headers = PreHeaders.H5();
    const response5 = await session.post(oauth2.tokenURL, form_data5, { headers:step5headers, withCredentials: true});
    const token = response5.data.access_token;

  // return response_status.toString();
  return {error: null, token: token};
}