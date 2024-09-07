import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    
    const code = url.searchParams.get('code');
    const session_ = url.searchParams.get('session_state');
    const client_id = url.searchParams.get('client_id');
    const redirect_uri = url.searchParams.get('redirect_uri');
    const code_verifier = url.searchParams.get('code_verifier');
    
    if (!code || !session_ || !client_id || !redirect_uri || !code_verifier) {
        throw error(400, 'Bad Request');
    }

    const response = await fetch(`https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: client_id,
            redirect_uri: redirect_uri,
            code_verifier: code_verifier,
            code,
        }),
    });
    const data = await response.json();
    console.log(data);
    const token = data.access_token;

    return new Response(JSON.stringify({ token }));

};