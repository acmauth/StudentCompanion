/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import sisAuthenticator from '../../lib/universisAuthentication/scraper/sisAuthenticator';

// Server function that handles the login request
export const GET: RequestHandler = async ({ url }) => {
    
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

	if (!username || !password) {
		throw error(400, 'Bad Request');
	}
    
	const token = await sisAuthenticator(username, password);
	if (!token) {
		throw error(401, 'Unauthorized');
	}

	return new Response(JSON.stringify({...token}));
};
