import { get } from "svelte/store";
import { userCreds } from "./authentication/authStore";
import { elearningGet as internalelearningGet } from "./elearningAuthentication/elearningDataService";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const universisGet = async (endpoint: string) => {

    //Todo: Add a check for the token's validity. If it's invalid, try to get a new one.
    //Todo: Set token in config file
    const url = `https://universis-api.it.auth.gr/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${get(userCreds).token}`,
      },
    });
    //Todo: Check result for errors
    const data = await response.json();
    return data;
    
  };

  export async function elearningGet(dataArguments: any){

    const response =  await internalelearningGet(dataArguments);
    console.log(response);
    return response;
    
}