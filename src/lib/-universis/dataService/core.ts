import { get } from "svelte/store";
import { keyCloakStore } from "$stores/keycloak.store.js";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
import reauthenticate from "../authenticator/reauthenticate.js";
import KeycloakClient from "$lib/keycloak/core";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const apiRequest = async (endpoint: string): Promise<Object> => {
    console.log(KeycloakClient);
    console.log("HERE");
    const token = get(keyCloakStore).token;
    
    // We get the token from the store
    const url = `https://universis-api.it.auth.gr/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // On a 498 status code, we try to get a new token and then we try to get the data again
    if (response.status === 498) {
      console.log("498498")
      // // If we tried too many times, we throw an error
      // const updated = await KeycloakClient.updateToken(5).then(
      //   function(refreshed) { 
      //     if (refreshed) { 
      //       console.log('Token was successfully refreshed'); 
      //     } else { 
      //       console.log('Token is still valid'); 
      //     } }).catch(
      //       function() { 
      //         console.log('Failed to refresh the token, or the session has expired'); 
      //       });
      console.log("Updated");
      console.log(updated);
      if (!updated) {
        console.log("Could not update token");
      }
      keyCloakStore.update((keycloak) => {
        keycloak.token = KeycloakClient.token as string;
        keycloak.refreshToken = KeycloakClient.refreshToken as string;
        keycloak.idToken = KeycloakClient.idToken as string
        return keycloak;
        }
      );
      // And then we try to get the data again
      return await apiRequest(endpoint);
    }

    reset();
    //Todo: Check result for errors
    const data = await response.json();
    return data;
    
};

