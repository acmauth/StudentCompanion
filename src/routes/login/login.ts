import { Capacitor } from "@capacitor/core";
import { goto } from "$app/navigation";
import OIDCClient from "$lib/authentication/OIDCClient";
import Config from "$src/app.config";


// Initialize OIDC client
export const authClient = new OIDCClient(Config.auth);

let loading = false;
let error = '';
let userInfo: any = null;
let isAuthenticated = false;

export async function handleCallback(url: string, loading: boolean) {
    loading = true;
    error = '';
    
    try {
      const tokens = await authClient.handleCallback(url);
      console.log('Login successful', tokens);
      
      // Get user info
      userInfo = await authClient.getUserInfo();
      isAuthenticated = true;
      
      // Clean URL and redirect
      goto('/pages/homepage', { replaceState: true });
    } catch (err) {
      console.error('Login failed:', err);
      error = err.message || 'Authentication failed';
      isAuthenticated = false;
    } finally {
      loading = false;
    }
  }

export async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      await authClient.login();
    } catch (err) {
      console.error('Login initiation failed:', err);
      error = err.message || 'Failed to initiate login';
      loading = false;
    }
  }

export async function handleLogout() {
    loading = true;
    error = '';
    
    try {
      await authClient.logout();
      userInfo = null;
      isAuthenticated = false;
      goto('/login', { replaceState: true });
    } catch (err) {
      console.error('Logout failed:', err);
      error = err.message || 'Logout failed';
    } finally {
      loading = false;
    }
  }

export async function testApiCall() {
    loading = true;
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
    } finally {
      loading = false;
    }
}


