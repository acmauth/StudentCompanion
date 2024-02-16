interface elearningResponseItem {
    error: boolean;
    exception?: { errorcode: string; message: string; } | undefined;
    data?: any | undefined;
}

interface elearningResponse extends Array<elearningResponseItem> {}

export async function ElearningGet(dataArguments: string, sesskey: string, moodleSession: string): Promise<any>{

    console.log("Running on production-internalElearningGet");
    
    
    const response = await fetch('https://elearning.auth.gr/lib/ajax/service.php?sesskey='+sesskey, {
                method: 'POST',
                body: JSON.stringify(dataArguments),
                headers: {
                    'Cookie': 'MoodleSession='+moodleSession
                },
                credentials: 'include'
    });
    

    const responseRaw: elearningResponse = await response.json();
    
    return responseRaw;

}
