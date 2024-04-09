import { connect } from 'imap-simple';
import { userCreds } from "$stores/credentials.store";
import { get } from "svelte/store";
import type { WebmailInboxRequestResponse } from "$lib/-webmail/types.ts";

export async function getInbox(): Promise<WebmailInboxRequestResponse> {
  const config = {
    imap: {
      user: get(userCreds).username,
      password: get(userCreds).password,
      host: 'mail.auth.gr',
      port: 993,
      tls: true,
    },
  };
  
  try {
    const connection = await connect(config);
    await connection.openBox('INBOX');
    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: [''],
      struct: true,
      markSeen: false,
      reverse: true,
      limit: 8,
    };
    const emails = await connection.search(searchCriteria, fetchOptions);
    connection.end();
    return { error: null, received: emails.map(email => email.parts[0].body) };
  } catch (error) {
    throw error;
  }
}
