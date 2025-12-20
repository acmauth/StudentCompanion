import { loginStore } from './loginStore';
import type { LoginTokens } from './loginStore';
import { get } from 'svelte/store';
import { jwtDecode } from "jwt-decode";
import { goto } from '$app/navigation';
import { toastController } from 'ionic-svelte';
/**
 * Flexible OpenID Connect Client with PKCE for Capacitor Apps
 * Supports both mobile (in-app browser) and web browser flows
*/

type OIDCClientConfig = {
  authUrl: string;            // Authorization endpoint URL
  tokenUrl: string | undefined;           // Token endpoint URL
  userInfoUrl: string;        // User info endpoint URL
  logoutUrl: string;          // Logout endpoint URL
  clientId: string;           // OAuth2 Client ID
  redirectUri: string;        // Redirect URI registered with the provider
  scope?: string;             // Scopes to request (default: 'openid')
  realm?: string;             // Realm or tenant if applicable
  // Capacitor-specific
  isMobile?: boolean ;         // Whether running in a mobile environment
  // Optional: custom storage (defaults to sessionStorage/localStorage)
  storage?: Storage;
  isProduction: boolean;
};

class OIDCClient {
  private config: OIDCClientConfig;
  constructor(config: OIDCClientConfig) {
    this.config = {
      authUrl: config.authUrl,
      tokenUrl: config.tokenUrl,
      userInfoUrl: config.userInfoUrl,
      logoutUrl: config.logoutUrl,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scope: config.scope || 'openid',
      realm: config.realm,
      // Capacitor-specific
      isMobile: config.isMobile || false,
      // Optional: custom storage (defaults to sessionStorage/localStorage)
      storage: config.storage || window.sessionStorage,
      isProduction: config.isProduction,
    };
    
    // Build URLs with realm if provided
    if (this.config.realm) {
      const baseUrl = this.config.authUrl;
      this.config.authUrl = `${baseUrl}/realms/${this.config.realm}/protocol/openid-connect/auth`;
      this.config.tokenUrl = this.config.tokenUrl || `${baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;
      this.config.userInfoUrl = this.config.userInfoUrl || `${baseUrl}/realms/${this.config.realm}/protocol/openid-connect/userinfo`;
      this.config.logoutUrl = this.config.logoutUrl || `${baseUrl}/realms/${this.config.realm}/protocol/openid-connect/logout`;
    }
  }

  // Generate random string for state and code verifier
  generateRandomString(length = 43) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
      .map(v => charset[v % charset.length])
      .join('');
  }

  // Generate SHA-256 hash and base64url encode for PKCE
  async generateCodeChallenge(verifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(hash);
  }

  base64UrlEncode(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Store data securely
  setItem(key: string, value: string) {
    if (this.config.storage) {
      this.config.storage.setItem(key, value);
    }
  }

  getItem(key: string) {
    if (this.config.storage) {
      return this.config.storage.getItem(key);
    }
    return null;
  }

  removeItem(key: string) {
    if (this.config.storage) {
      this.config.storage.removeItem(key);
    }
  }

  // Store credentials in loginStore
  setItemInStore(key: keyof LoginTokens, value: string) {
    loginStore.update((store) => {
      return { ...store, [key]: value}
    }
    );
  }

  getItemFromStore(key: keyof LoginTokens) {
    const store = get(loginStore);
    return store[key];
  }

  removeItemFromStore(key: keyof LoginTokens) {
    loginStore.update((store) => {
      return { ...store, [key]: "" };
    });
  }

  // Build authorization URL
  async buildAuthUrl() {
    // const state = this.generateRandomString();
    const state = encodeURIComponent(btoa(`{"production":${this.config.isProduction}}`));
    const codeVerifier = this.generateRandomString();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store state and verifier for validation later
    this.setItem('oidc_state', state);
    this.setItem('oidc_code_verifier', codeVerifier);

    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', this.config.clientId);
    params.append('redirect_uri', this.config.redirectUri);
    if (this.config.scope) {
      params.append('scope', this.config.scope);
    }
    params.append('state', state);
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');

    return `${this.config.authUrl}?${params.toString()}`;
  }

  // Initiate login flow
  async login() {
    const authUrl = await this.buildAuthUrl();

    if (this.config.isMobile) {
      // Use Capacitor's Browser plugin for mobile
      // Import: import { Browser } from '@capacitor/browser';
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url: authUrl });
    } else {
      // Web: redirect to auth URL
      window.location.href = authUrl;
    }
  }

  // Handle callback after redirect
  async handleCallback(callbackUrl: string) {

    if (this.config.isMobile) {
      // Close the in-app browser
      const { Browser } = await import('@capacitor/browser');
      await Browser.close();
    }

    const url = new URL(callbackUrl);
    const params = new URLSearchParams(url.search);
    
    const code = params.get('code') as string;
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      throw new Error(`OAuth error: ${error} - ${params.get('error_description')}`);
    }

    // Validate state
    const storedState = this.getItem('oidc_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for tokens
    const codeVerifier = this.getItem('oidc_code_verifier') as string;
    const tokens = await this.exchangeCodeForTokens(code, codeVerifier);

    // Clean up
    this.removeItem('oidc_state');
    this.removeItem('oidc_code_verifier');

    // Store tokens
    this.setItemInStore('access_token', tokens.access_token);
    this.setItemInStore('refresh_token', tokens.refresh_token);
    this.setItemInStore('id_token', tokens.id_token);
    
    if (tokens.expires_in) {
      const expiresAt = Date.now() + (tokens.expires_in * 1000);
      this.setItemInStore('expires_at', expiresAt.toString());
    }

    return tokens;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string, codeVerifier: string) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      code_verifier: codeVerifier
    });

    const response = await fetch(this.config.tokenUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return await response.json();
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = this.getItemFromStore('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId
    });

    const response = await fetch(this.config.tokenUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    const tokens = await response.json();

    // Update stored tokens
    this.setItemInStore('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      this.setItemInStore('refresh_token', tokens.refresh_token);
    }
    if (tokens.id_token) {
      this.setItemInStore('id_token', tokens.id_token);
    }
    if (tokens.expires_in) {
      const expiresAt = Date.now() + (tokens.expires_in * 1000);
      this.setItemInStore('expires_at', expiresAt.toString());
    }

    return tokens;
  }

  // Get current access token (with auto-refresh)
  async getAccessToken() {
    const token = this.getItemFromStore('access_token');
    const expiresAt = this.getItemFromStore('expires_at');

    if (!token) {
      return null;
    }

    // Check if token is expired or about to expire (within 5 minutes)
    if (expiresAt && Date.now() > (parseInt(expiresAt) - 300000)) {
      try {
        const tokens = await this.refreshToken();
        return tokens.access_token;
      } catch (err) {
        console.error('Token refresh failed:', err);
        return null;
      }
    }

    return token;
  }

  // Get user info
  async getUserInfo() {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(this.config.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await response.json();
  }

  // Logout
  async logout() {
    // const idToken = this.getItemFromStore('id_token');
    
    // Clear stored tokens
    this.removeItemFromStore('access_token');
    this.removeItemFromStore('refresh_token');
    this.removeItemFromStore('id_token');
    this.removeItemFromStore('expires_at');

    // Perform server-side logout
    // if (false && idToken && this.config.logoutUrl) {
    //   const params = new URLSearchParams({
    //     id_token_hint: idToken,
    //     post_logout_redirect_uri: this.config.redirectUri
    //   });

    //   const logoutUrl = `${this.config.logoutUrl}?${params.toString()}`;

    //   // if (this.config.isMobile) {
    //   //   const { Browser } = await import('@capacitor/browser');
    //   //   await Browser.open({ url: logoutUrl });
    //   // } else {
    //   //   window.location.href = logoutUrl;
    //   // }
      
    // }
    const showToast = async () => {
        const toast = await toastController.create({
           color: 'danger',
           duration: 4000,
           message: 'Η σύνδεσή σου έληξε. Θα χρειαστεί να συνδεθείς ξανά.',
        });
     
        toast.present();
      };
      showToast();
      console.log("[OIDCClient] Redirecting to login due to token expiration");

      goto("/login?token_expired=true");
  }

  isExpired() {
    const expiresAt = this.getItemFromStore('expires_at');
    if (expiresAt) {
      return Date.now() > parseInt(expiresAt);
    }
    return true;
  }

  isRefreshable() {
    // With offline access scope, refresh token can't expire
    const refreshToken = this.getItemFromStore('refresh_token');
    return !!refreshToken;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.isRefreshable();    
  }

  // Make authenticated API request
  async fetch(url: string, options: RequestInit = {}) {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    return fetch(url, { ...options, headers });
  }
}

// Export for use
export default OIDCClient;

// Example usage:
/*
import OIDCClient from './oidc-client';
import { Capacitor } from '@capacitor/core';

const client = new OIDCClient({
  authUrl: 'https://oauth2.it.auth.gr/auth',
  realm: 'universis',
  clientId: 'aristomate',
  redirectUri: 'https://applink.aristomate.gr/authsso/callback',
  scope: 'student:read',
  isMobile: Capacitor.isNativePlatform()
});

// Login
await client.login();

// Handle callback (call this when your app receives the redirect)
await client.handleCallback(window.location.href);

// Get user info
const userInfo = await client.getUserInfo();

// Make authenticated request
const response = await client.fetch('https://api.example.com/data');

// Logout
await client.logout();
*/
