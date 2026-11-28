import type { ApiRequestResults, ElearningRequest } from "$services/elearning/types";

export async function apiRequest(request: ElearningRequest): Promise<ApiRequestResults> {
    const {credentials, dataArguments} = request;
    const {sesskey, moodleSession} = credentials;

    const elearningData = await fetch("/webserver/elearning?sesskey="+sesskey+"&moodlesession="+moodleSession, {
        method: "POST",
        body: JSON.stringify({  userArgs: dataArguments,
                                sesskey: sesskey,
                                moodleSession: moodleSession})
    });
    
    let response = (await elearningData.json())[0];
    let data = {error: response.error ? response.exception?.errorcode : null, data: response.data};
    return data;
}

