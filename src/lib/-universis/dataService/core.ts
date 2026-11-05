import { get } from "svelte/store";
import OIDCClient from "$src/lib/authentication/OIDCClient.js";
import { tries, increment, reset } from "../stores/reAuthTries.store.js";
import { userTokens } from "$stores/credentials.store";
import reauthenticate from "../authenticator-deprecated/reauthenticate.js";
import { Capacitor } from "@capacitor/core";
import Config from "$src/app.config";
import { ApiError, AuthExpiredError, NetworkError } from "$lib/errors";

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
// Throws AuthExpiredError, NetworkError or ApiError.
export const apiRequest = async (endpoint: string): Promise<Object> => {

  return await oidcApiRequest(endpoint);

};

// Returns a usable access token, refreshing it first if it has expired.
// Logs the user out only when the server rejects the refresh token.
async function getValidToken(authClient: OIDCClient): Promise<string> {

  if (!authClient.isRefreshable()) {
    throw new AuthExpiredError('No refresh token');
  }

  if (authClient.isExpired()) {
    try {
      await authClient.refreshToken();
    } catch (error) {
      if (error instanceof AuthExpiredError) await authClient.logout();
      throw error;
    }
  }

  return authClient.getItemFromStore('access_token');
}

async function oidcApiRequest(endpoint: string): Promise<Object> {

  const authClient = new OIDCClient(Config.auth);
  const token = await getValidToken(authClient);

  const url = `${Config.universis.api}/${endpoint}`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new NetworkError(`Request to ${endpoint} failed: ${error}`);
  }

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error ${response.status} on ${endpoint}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
