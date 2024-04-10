import type { RequestHandler } from '@sveltejs/kit';
import { ImapFlow } from 'imapflow';

export const POST: RequestHandler = async ({ request }) => {
	
	const requestBody = await request.json();
	let response; 
	let emails = [];

	const client = new ImapFlow({
		host: requestBody.server,
		port: requestBody.port,
		secure: true,
		auth: {
			user: requestBody.username,
			pass: requestBody.password
		},
		logger: false
	});

	await client.connect();

	let lock = await client.getMailboxLock('INBOX');
	try {
		let message = await client.fetchOne(client.mailbox.exists, { source: true });
        console.log(message.source.toString());

        for await (let message of client.fetch('1:2', { envelope: true })) {
            // console.log(`${message.envelope.subject}`);
			emails.push(message);
        }
		response = { error: null, received: emails };
	} catch (err) {
		response = { error: err.message };
	} finally {
		lock.release();
	}
	
	await client.logout();
	return new Response(JSON.stringify(response));
};
