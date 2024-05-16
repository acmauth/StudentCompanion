// src/hooks.server.js
import { logger } from './lib/functions/misc/logger';
const isProduction = process.env.NODE_ENV === 'production';

export async function handle({ event, resolve }) {
    const { url, request } = event;

    try {
        if (!isProduction) {   
            const userAgent = request.headers.get('user-agent') || 'unknown';   
            logger(url, userAgent);
        }
    }
    catch (error) {
        console.error('Error logging visit data:', error);
    }

    return resolve(event);
}
