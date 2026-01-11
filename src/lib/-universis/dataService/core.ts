import { get } from "svelte/store";
import OIDCClient from "$src/lib/authentication/OIDCClient.js";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
import { userTokens } from "$stores/credentials.store";
import reauthenticate from "../authenticator-deprecated/reauthenticate.js";
import { Capacitor } from "@capacitor/core";
import Config from "$src/app.config";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const apiRequest = async (endpoint: string): Promise<Object> => {
    
  return await oidcApiRequest(endpoint);
  
};

async function oidcApiRequest(endpoint: string): Promise<Object> {
    /*
      This function is a wrapper for the login, using the OIDC credential API.
    */
      const authClient = new OIDCClient(Config.auth);


    if (authClient.isExpired()) {
      // If the token is not valid, we try to get a new one
      if (authClient.isRefreshable()) {
        // If the refresh token is still valid, we try to get a new token
        try {
          await authClient.refreshToken();
        } catch (error) {
          // If the refresh fails, we logout the user
          await authClient.logout();
        }
      } else {
        // If the refresh token is not valid, we redirect the user to the login page
        await authClient.logout();
      }
    }
    
    let token: string = "";
    try {
      // If we reach this point, the token is valid
      token = await authClient.getAccessToken();
    } catch (error) {
      // If there was an error refreshing the token, we logout the user
      await authClient.logout();
    }
    
    // We get the token from the store
    const url = `${Config.universis.api}/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    //Todo: Check result for errors
    const data = await response.json();
    return data;
}