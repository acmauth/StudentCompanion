<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import OIDCClient from '$lib/authentication/OIDCClient';
	import { Capacitor } from '@capacitor/core';
	import { App } from '@capacitor/app';
	import { handleLogin, handleCallback, handleLogout } from './login';
	import Config from "$src/app.config"
	import { helpCircle } from 'ionicons/icons';
	import Vector from '$lib/components/loginService/Vector.svg';
	import Vector1 from '$lib/components/loginService/Vector(1).svg';
	import Logo from '$lib/assets/Logo_head.png';

  // Initialize OIDC client
  const authClient = new OIDCClient(Config.auth);

  let loading = false;
  let error = '';
  let userInfo: any = null;
  let isAuthenticated = false;

  onMount(async () => {
    // Check if already authenticated
    isAuthenticated = authClient.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        userInfo = await authClient.getUserInfo();
      } catch (err) {
        console.error('Failed to get user info:', err);
        error = 'Session expired';
        isAuthenticated = false;
      }
    }

    // Handle callback from OAuth server (web)
    if ($page.url.searchParams.has('code') || $page.url.searchParams.has('error')) {
      await handleCallback($page.url.href, loading);
    }

    // Handle callback from deep link (mobile)
    if (Config.isMobile) {
      App.addListener('appUrlOpen', async (event) => {
        if (event.url.includes('authsso/callback')) {
          await handleCallback(event.url, loading);
        }
      });
    }
  });

</script>


<ion-content fullscreen>
	<!-- Hero Section -->
	<div class="hero-container">
		<img src={Vector} alt="Vector" class="hero-bg" />
		<img src={Vector1} alt="Overlay Icon" class="hero-overlay" />
	</div>

	<!-- Main Content -->
	<div class="main-content">
		<img src={Logo} alt="Aristomate logo" class="logo" />
		
		<div class="academiclogin">
			<ion-text>Καλώς ήρθες στο Aristomate!</ion-text>
		</div>

		

		<!-- Loading Overlay -->
		{#if loading}
			<div class="loading-panel">
				<ion-spinner class="loginSpinner" />
				<p class="loginP">Περιμένετε...</p>
			</div>
		{/if}

    {#if error}
      <div class="error">
        <strong>Error:</strong> {error}
      </div>
    {/if}

		<!-- Login Button -->
		<ion-button class="custom" on:click={handleLogin} aria-hidden>
			Σύνδεση ΑΠΘ
		</ion-button>

		<!-- Footer -->
		<div class="footer">
			<ion-title size="small" color="primary">
				Powered by<br />
				<strong>Aristotle University of Thessaloniki</strong>.
			</ion-title>
		</div>
	</div>
</ion-content>

<style>
	.hero-container {
		position: relative;
		width: 100%;
		height: 40%;
	}

	.hero-bg {
		position: absolute;
		width: 110%;
		height: 70%;
	}

	.hero-overlay {
		width: 110%;
		height: 85%;
	}

	.main-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: top;
		margin-top: -40px;
		padding: 0 20px;
	}

	.logo {
		width: 30%;
		margin-bottom: 25px;
	}

	.academiclogin {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		color: #98bdd6;
		margin-bottom: 10px;
	}

	.help-link {
		display: flex;
		align-items: center;
	}

	.help-icon {
		width: 2rem;
		height: 2rem;
		color: var(--ion-color-primary);
	}

	ion-button.custom {
		--background: var(--ion-color-primary);
		--color: var(--ion-color-light);
		--border-radius: 1rem;
		--box-shadow: var(--shadow-sort-md);
		width: 60%;
		height: 3rem;
		margin-top: 2rem;
	}

	.loading-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	ion-spinner.loginSpinner {
		--color: white;
		margin-right: 10px;
	}

	p.loginP {
		color: white;
		margin: 0;
	}

	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding-top: 35px;
		position: absolute;
		bottom: 0;
	}

	.footer ion-title {
		padding-bottom: 15px;
		font-size: small;
	}

	.centered-text {
		text-align: center;
		margin: 1rem;
		width: 100%;
	}

	.modal-item {
		--padding-start: 16px;
		--padding-end: 16px;
		max-width: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>
