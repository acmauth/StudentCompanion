import { appendFile, existsSync, writeFile } from 'fs';
import { createHash } from 'crypto';
import { resolve } from 'path';

const logFilePath = resolve('visit-log.csv');

/**
 * @param {{ pathname: any; }} url
 * @param {import("crypto").BinaryLike} userAgent
 */
export function logger(url, userAgent){
    // Hash the user-agent
    const hash = createHash('sha256').update(userAgent).digest('hex');
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp},${hash},${url.pathname}\n`;

    // Check if the log file exists
    if (!existsSync(logFilePath)) {
        // Create the file and write headers if it doesn't exist
        const headers = 'timestamp,hash,page\n';
        writeFile(logFilePath, headers, (err) => {
            if (err) {
                console.error('Error creating log file:', err);
            } else {
                // Append the first log entry after creating the file
                appendFile(logFilePath, logEntry, (err) => {
                    if (err) {
                        console.error('Error logging visit data:', err);
                    }
                });
            }
        });
    } else {
        // Append log entry to the file if it already exists
        appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Error logging visit data:', err);
            }
        });
    }
}