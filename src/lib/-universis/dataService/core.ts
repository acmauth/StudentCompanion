import { get } from "svelte/store";
import { userCreds, userTokens } from "$stores/credentials.store";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
import sisAuthenticator from "../authenticator/core";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const apiRequest = async (endpoint: string): Promise<Object> => {
    
    let _userTokens: any = get(userTokens); 
    // We get the token from the store
    const url = `https://universis-api.it.auth.gr/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${_userTokens.universis.token}`,
      },
    });
    
    // On a 498 status code, we try to get a new token and then we try to get the data again
    if (response.status === 498) {

      // If we tried too many times, we throw an error
      if (get(tries).count >= 3) {
        reset();
        throw new Error("Too many tries");
      }
      increment();
      
      // If the token is invalid, we try to get a new one
      let newToken = await sisAuthenticator(get(userCreds).username, get(userCreds).password);
      userTokens.update((newTokens) => {
        newTokens.universis.token = newToken.token as string; // Type assertion added here
        return newTokens;
      });
      // And then we try to get the data again
      return await apiRequest(endpoint);
    }

    reset();
    //Todo: Check result for errors
    const data = await response.json();
    return data;
    
};

