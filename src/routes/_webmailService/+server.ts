import { webmailInboxRequest } from '../../lib/-webmail/dataService/core';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(webmailInboxRequest()));
};

