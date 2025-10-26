<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import OIDCClient from '$lib/authentication/OIDCClient';
	import { Capacitor } from '@capacitor/core';
	import { App } from '@capacitor/app';
	import { handleLogin, handleCallback, handleLogout } from './login';
	import Config from "$src/app.config"
	import Logo from '$lib/assets/Logo_head.png';
	import UniversityLogo from '$lib/assets/authLogo.png';
	import { t, changeLocale } from '$lib/i18n';

  // Initialize OIDC client
  const authClient = new OIDCClient(Config.auth);

  let loading = false;
  let error = '';
  let userInfo: any = null;
  let isAuthenticated = false;
  let pageLoaded = false;

  onMount(async () => {
    // Delay to prevent layout shift
    setTimeout(() => {
      pageLoaded = true;
    }, 100);

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


<ion-content fullscreen class="login-content">
	<div class="gradient-background">
		<!-- Main Content -->
		<div class="main-content" class:loaded={pageLoaded}>
			<div class="language-switcher">
				<ion-button fill="clear" on:click={() => changeLocale('el')}>EL</ion-button>
				<ion-button fill="clear" on:click={() => changeLocale('en')}>EN</ion-button>
			</div>
			<div class="content-wrapper">
				<img src={Logo} alt="Aristomate logo" class="logo" />
				
				<h1 class="welcome-title">{@html $t('login.welcome')}</h1>
				<p class="welcome-subtitle">{$t('login.subtitle')}</p>

				<!-- Loading Overlay -->
				{#if loading}
					<div class="loading-panel">
						<ion-spinner class="loginSpinner" />
						<p class="loginP">{$t('login.waitMessage')}</p>
					</div>
				{/if}

				{#if error}
					<div class="error">
						<strong>Error:</strong> {error}
					</div>
				{/if}

				<!-- Login Button -->
				<ion-button class="login-button" on:click={handleLogin} expand="block">
					{$t('login.connection')}
				</ion-button>
			</div>

			<!-- Footer -->
			<div class="footer">
				<div class="footer-content">
					<img src={UniversityLogo} alt="AUTH Logo" class="university-logo" />
					<p class="footer-text">
						{$t('login.poweredBy')}<br />
						<strong>{$t('login.university')}</strong>
					</p>
				</div>
			</div>
		</div>
	</div>
</ion-content>

<style>
	.language-switcher {
		position: absolute;
		top: 20px;
		right: 20px;
		display: flex;
		gap: 8px;
		z-index: 2;
	}

	.language-switcher ion-button {
		--color: white;
		--padding-start: 8px;
		--padding-end: 8px;
		font-size: 14px;
		font-weight: 600;
	}
	.login-content {
		--background: transparent;
	}

	.gradient-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 0;
		background: radial-gradient(circle at 30% 30%, #1e3c72, #0a0e17 80%);
		background-blend-mode: overlay;
		filter: brightness(1.05) saturate(1.2);
		animation: gradientMove 20s ease-in-out infinite alternate;
	}

	/* Animated dark “blob” layers */
	.gradient-background::before,
	.gradient-background::after {
		content: "";
		position: absolute;
		width: 200%;
		height: 200%;
		top: -50%;
		left: -50%;
		background: radial-gradient(
			circle at 50% 50%,
			rgba(72, 133, 247, 0.7) 0%,
			rgba(2, 17, 43, 0.5) 25%,
			transparent 70%
		);
		mix-blend-mode: multiply;
		filter: blur(120px);
		animation: blobMove 60s cubic-bezier(0.42, 0, 0.58, 1) infinite;
	}

	.gradient-background::after {
		background: radial-gradient(
			circle at 70% 70%,
			rgba(72, 133, 247, 0.7) 0%,
			rgba(2, 17, 43, 0.5) 30%,
			transparent 80%
		);
		mix-blend-mode: screen;
		filter: blur(180px);
		animation: blobMoveAlt 70s ease-in-out infinite;
	}

	/* Subtle gradient motion */
	@keyframes gradientMove {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}

	@keyframes blobMove {
		0% {
			transform: translate(0%, 0%) scale(1);
		}
		50% {
			transform: translate(10%, -5%) scale(1.2);
		}
		100% {
			transform: translate(-5%, 10%) scale(1);
		}
	}

	@keyframes blobMoveAlt {
		0% {
			transform: translate(0%, 0%) scale(1);
		}
		50% {
			transform: translate(-10%, 10%) scale(1.15);
		}
		100% {
			transform: translate(5%, -5%) scale(1);
		}
	}
	.main-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 0 24px 140px 24px;
		z-index: 1;
		opacity: 0;
		transition: opacity 0.3s ease-out;
	}

	.main-content.loaded {
		opacity: 1;
	}

	.content-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 400px;
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.logo {
		width: 120px;
		height: 120px;
		margin-bottom: 40px;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.welcome-title {
		font-size: 28px;
		font-weight: 700;
		color: white;
		text-align: center;
		margin: 0 0 12px 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		letter-spacing: -0.5px;
	}

	.welcome-subtitle {
		font-size: 16px;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.9);
		text-align: center;
		margin: 0 0 48px 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.login-button {
		--background: rgba(255, 255, 255, 0.95);
		--background-hover: rgba(255, 255, 255, 1);
		--background-activated: rgba(255, 255, 255, 0.9);
		--color: #1e3c72;
		--border-radius: 14px;
		--box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		--padding-top: 16px;
		--padding-bottom: 16px;
		font-size: 17px;
		font-weight: 600;
		height: auto;
		width: auto;
		min-width: 200px;
		margin: 0;
		text-transform: none;
		letter-spacing: 0.3px;
		transition: all 0.3s ease;
	}

	.login-button:hover {
		transform: translateY(-2px);
		--box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
	}

	.login-button:active {
		transform: translateY(0);
	}

	.loading-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	ion-spinner.loginSpinner {
		--color: white;
		width: 48px;
		height: 48px;
		margin-bottom: 16px;
	}

	p.loginP {
		color: white;
		margin: 0;
		font-size: 16px;
		font-weight: 500;
	}

	.error {
		background-color: rgba(255, 77, 77, 0.15);
		border: 1px solid rgba(255, 77, 77, 0.3);
		color: white;
		padding: 12px 16px;
		border-radius: 12px;
		margin-bottom: 20px;
		width: 100%;
		text-align: center;
		font-size: 14px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 24px 24px 32px 24px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.15) 0%, transparent 100%);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}

	.footer-content {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.university-logo {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.95);
		padding: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	:global(body.dark) .university-logo {
		background: rgba(255, 255, 255, 0.9);
	}

	.footer-text {
		color: rgba(255, 255, 255, 0.9);
		font-size: 12px;
		font-weight: 400;
		margin: 0;
		line-height: 1.6;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.footer-text strong {
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		white-space: nowrap;
	}

	@media (max-height: 700px) {
		.logo {
			width: 90px;
			height: 90px;
			margin-bottom: 24px;
		}

		.welcome-title {
			font-size: 24px;
			margin-bottom: 8px;
		}

		.welcome-subtitle {
			font-size: 14px;
			margin-bottom: 32px;
		}

		.footer {
			padding: 16px 24px 20px 24px;
		}

		.university-logo {
			width: 40px;
			height: 40px;
		}

		.footer-text {
			font-size: 12px;
		}
	}


</style>
