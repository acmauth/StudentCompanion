/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import elearningAuthenticator from '$lib/elearningAuthentication/scraper/elearningAuthenticator';
import { elearningGet, internalElearningGet } from '$lib/elearningAuthentication/elearningDataService';

// Server function that handles the login request
export const GET: RequestHandler = async ({ url }) => {
    
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

	if (!username || !password) {
		throw error(400, 'Bad Request');
	}
    
	const token = await elearningAuthenticator(username, password);
	if (!token) {
		throw error(401, 'Unauthorized');
	}

	return new Response(JSON.stringify({...token}));
};


// Server function that handles the data request
export const POST: RequestHandler = async ({ request }) => {
	
    const requestBody = await request.json();

	const response = await internalElearningGet(requestBody.userArgs, requestBody.sesskey, requestBody.moodleSession);

    return new Response(JSON.stringify(response));
};

