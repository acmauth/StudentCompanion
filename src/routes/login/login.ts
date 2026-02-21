import { Capacitor } from "@capacitor/core";
import { goto } from "$app/navigation";
import OIDCClient from "$lib/authentication/OIDCClient";
import Config from "$src/app.config";


// Initialize OIDC client
export const authClient = new OIDCClient(Config.auth);

let error = '';
let userInfo: any = null;
let isAuthenticated = false;

export async function handleCallback(url: string) {
    error = '';
    
    try {
      const tokens = await authClient.handleCallback(url);
      // console.log('Login successful', tokens);

      // Get user info
      userInfo = await authClient.getUserInfo();
      isAuthenticated = true;

      // Clean URL and redirect
      // console.log("[src/login/login.ts] Navigating to homepage");
      goto('/pages/homepage', { replaceState: true });
    } catch (err) {
      console.error('Login failed:', err);
      error = err.message || 'Authentication failed';
      isAuthenticated = false;
    }
  }

export async function handleLogin() {
    error = '';
    
    try {
      await authClient.login();
    } catch (err) {
      console.error('Login initiation failed:', err);
      error = err.message || 'Failed to initiate login';
    }
  }

export async function handleLogout() {
    error = '';
    
    try {
      await authClient.logout();
      userInfo = null;
      isAuthenticated = false;
      console.log("[src/routes/login/login.ts] Navigating to login");
      goto('/login', { replaceState: true });
    } catch (err) {
      console.error('Logout failed:', err);
      error = err.message || 'Logout failed';
    }
  }

export async function testApiCall() {
    error = '';
    
    try {
      // Example API call - replace with your actual endpoint
      const response = await authClient.fetch('https://api.example.com/test');
      const data = await response.json();
      console.log('API Response:', data);
      alert('API call successful! Check console for response.');
    } catch (err) {
      console.error('API call failed:', err);
      error = err.message || 'API call failed';
    }
}


