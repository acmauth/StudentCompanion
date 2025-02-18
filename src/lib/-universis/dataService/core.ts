import { get } from "svelte/store";
import { keyCloakStore, getToken, refreshToken, getValidity, getRefreshEligibility, logout } from "$stores/keycloak.store.js";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
import { userCreds, userTokens, useAlternativeLogin } from "$stores/credentials.store";
import reauthenticate from "../authenticator-deprecated/reauthenticate.js";
import KeycloakClient from "$src/routes/login/core.js";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const apiRequest = async (endpoint: string): Promise<Object> => {
    
    if (!get(useAlternativeLogin)) {
        return await keyClockApiRequest(endpoint);
    } else {
      return await alternativeLoginApiRequest(endpoint);
    }
    
};

async function keyClockApiRequest(endpoint: string): Promise<Object> {
    /*
      This function is a wrapper for the login, using the keycloak credential API.
    */

    if (!getValidity()) {
      // If the token is not valid, we try to get a new one
      if (getRefreshEligibility()) {
        // If the refresh token is still valid, we try to get a new token
        await refreshToken();
      } else {
        // If the refresh token is not valid, we redirect the user to the login page
        logout();
      }
    }
  
    const token = get(keyCloakStore).token;
    
    // We get the token from the store
    const url = `https://universis-api.it.auth.gr/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    //Todo: Check result for errors
    const data = await response.json();
    return data;
}

async function alternativeLoginApiRequest(endpoint: string): Promise<Object> {
    /*
      This function is a wrapper for the login, using the keycloak credential API.
    */

        
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
        await reauthenticate();
  
        // And then we try to get the data again
        return await apiRequest(endpoint);
      }
  
      reset();
      //Todo: Check result for errors
      const data = await response.json();
      return data;
}