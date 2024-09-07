import { Capacitor } from "@capacitor/core";
import { apiRequest as webApiRequest } from "../plugins/webserver/dataservice";
import { apiRequest as nativeApiRequest } from "../plugins/native/dataservice";
import type { ElearningRequest, ApiRequestResults, ElearningCredentials } from "$lib/-elearning-deprecated/types";
import reauthenticate from "$lib/-elearning-deprecated/authenticator/reauthenticate";
import { get } from "svelte/store";
import { userTokens } from "$stores/credentials.store";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
const isNative = Capacitor.isNativePlatform();


export async function apiRequest(dataArguments: any) {
    let credentials: ElearningCredentials = get(userTokens).elearning;
    let dataRequest: ElearningRequest = {credentials: credentials, dataArguments: dataArguments};
    let dataRequestResults: ApiRequestResults;

    if (isNative) {
        dataRequestResults = await nativeApiRequest(dataRequest);
    } else {
        dataRequestResults =  await webApiRequest(dataRequest);
    }

    // Check if the token is invalid
    if (dataRequestResults.error=== "invalidsesskey" || dataRequestResults.error=== "servicerequireslogin") {
        // (responseObject.exception?.errorcode === "invalidsesskey" || responseObject.exception?.errorcode === "servicerequireslogin")
        // If we tried too many times, we throw an error
      if (get(tries).count >= 3) {
        reset();
        throw new Error("Too many tries");
      }
      increment();
      
      // If the token is invalid, we try to get a new one
      await reauthenticate();
      
      // And then we try to get the data again
      return await apiRequest(dataArguments);
    }

    reset();

    return dataRequestResults;
}