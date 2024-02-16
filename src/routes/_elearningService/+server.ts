/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import elearningAuthenticator from '$lib/-elearning/plugins/webserver/_webScraper';
import { ElearningGet } from '$lib/-elearning/plugins/webserver/_webDataservice';

// Server function that handles the login request
export const GET: RequestHandler = async ({ url }) => {
    
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

	if (!username || !password) {
		throw error(400, 'Bad Request');
	}
    
	const response = await elearningAuthenticator(username, password);
	if (response.error) {
		throw error(401, 'Unauthorized');
	}

	return new Response(JSON.stringify(response));
};


// Server function that handles the data request
export const POST: RequestHandler = async ({ request }) => {
	
    const requestBody = await request.json();

	const response = await ElearningGet(requestBody.userArgs, requestBody.sesskey, requestBody.moodleSession);

    return new Response(JSON.stringify(response));
};

