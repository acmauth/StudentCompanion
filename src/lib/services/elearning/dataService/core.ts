import { Capacitor } from "@capacitor/core";
import { apiRequest as webApiRequest } from "$services/elearning/plugins/webserver/dataService";
import { apiRequest as nativeApiRequest } from "$services/elearning/plugins/native/dataService";
import type { ElearningRequest, ApiRequestResults, ElearningCredentials } from "$services/elearning/types";
import reauthenticate from "$services/elearning/authenticator/reauthenticate";
import { get } from "svelte/store";
import { userTokens } from "$services/authentication/credentialsStore";
import { tries, increment, reset } from "$services/elearning/stores/reAuthTriesStore.js";
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