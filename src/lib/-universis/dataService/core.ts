import { get } from "svelte/store";
import { keyCloakStore, getToken, refreshToken, getValidity, getRefreshEligibility, logout } from "$stores/keycloak.store.js";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
import reauthenticate from "../authenticator-deprecated/reauthenticate.js";
import KeycloakClient from "$src/routes/login/core.js";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const apiRequest = async (endpoint: string): Promise<Object> => {
    
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
    
};

