import { get } from "svelte/store";
import { userCreds, userTokens } from "../../stores/credentials.store";
import { tokenGrab } from "./tokenGeneratorWorker";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const universisGet = async (endpoint: string) => {

    //Todo: Add a check for the token's validity. If it's invalid, try to get a new one.
    //Todo: Set token in config file
    const url = `https://universis-api.it.auth.gr/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${get(userTokens).universis.token}`,
      },
    });
    
    if (response.status === 498) {
      // If the token is invalid, we try to get a new one
      let newToken = await tokenGrab(get(userCreds).username, get(userCreds).password);
      userTokens.update((newTokens) => {
        newTokens.universis.token = newToken.token;
        return newTokens;
      });
      // And then we try to get the data again
      return await universisGet(endpoint);
    }

    //Todo: Check result for errors
    const data = await response.json();
    return data;
    
  };

