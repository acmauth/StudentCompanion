import type { ApiRequestResults, ElearningRequest } from "$lib/-elearning/types";
import { ElearningPlugins } from "./nativeDefinitions";

export async function apiRequest(request: ElearningRequest): Promise<ApiRequestResults> {
    const {credentials, dataArguments} = request;
    const {sesskey, moodleSession} = credentials;

    const response = await ElearningPlugins.apiGet({sesskey: sesskey, moodleSession: moodleSession, dataArguments: JSON.stringify(dataArguments)});
    console.log(response);
    
    if (response.error) {
        return {error: response.reason};
    }
    else {
        let data;
        // response.data in the form 
        // "[{"error":true,"exception":{"message":"\u0397 \u03c5\u03c0\u03b7\u03c1\u03b5\u03c3\u03af\u03b1 \u03b9\u03c3\u03c4\u03bf\u03cd \u03b4\u03b5\u03bd \u03b5\u03af\u03bd\u03b1\u03b9 \u03b4\u03b9\u03b1\u03b8\u03ad\u03c3\u03b9\u03bc\u03b7. (\u0397 \u03c3\u03cd\u03bd\u03bf\u03b4\u03bf\u03c2 \u03b1\u03c0\u03bf\u03c3\u03c5\u03bd\u03b4\u03ad\u03b8\u03b7\u03ba\u03b5 \u03ae \u03ad\u03c7\u03b5\u03b9 \u03bb\u03ae\u03be\u03b5\u03b9.)","errorcode":"servicerequireslogin","link":"https:\/\/elearning.auth.gr\/","moreinfourl":"http:\/\/docs.moodle.org\/39\/el\/error\/webservice\/servicerequireslogin"}}]"
        if ('data' in response) {
            data = JSON.parse(response.data)[0];
        }
        let error = data.error? data.exception.errorcode: null;
        return {error: error, data: data.data};
    }
}