/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    
    // data = ... 
    // getting the data from the cafeteria website

	return new Response(JSON.stringify(data));
};