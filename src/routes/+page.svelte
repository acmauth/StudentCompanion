<script lang="ts">
	import { goto } from '$app/navigation';
	import { judgeAuth } from '$services/authentication/authValidator';
	import { onMount } from 'svelte';
	import Logo from '$assets/common/brand/Logo_full.png';
	import { neoUniversisGet } from '$services/dataService';
	import { loadPersistedStores } from '$services/storage/persisted/persistedStoreDeclarations';
	import { App } from '@capacitor/app';
	import { AuthExpiredError } from '$services/errors';

	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function preFlightCache() {
		await neoUniversisGet('Students/me?$expand=studyProgram($expand=studyLevel), department');
		await neoUniversisGet('students/me/courses?$top=-1');
	}

	function goToLogin() {
		console.log("[src/routes/+page.svelte] Navigating to login");
		goto('/login?token_expiry=true');
	}

	// Handling the redirect to the homepage
	onMount(async () => {
		await loadPersistedStores();

		if (!(await judgeAuth())) {
			goToLogin();
			return;
		}

		// Warming the cache is best-effort. Pages fall back to stale cache
		// or show their own error, so only an expired session blocks entry.
		try {
			await preFlightCache();
		} catch (error) {
			if (error instanceof AuthExpiredError) {
				goToLogin();
				return;
			}
			console.warn("[src/routes/+page.svelte] Preflight failed:", error);
		}

		console.log("[src/routes/+page.svelte] Navigating to homepage");
		goto('/pages/homepage');
	});
</script>

<ion-grid class="ion-text-center center-grid">
	<img src={Logo} alt="Aristomate logo" class="pop-up-image" style="width: 80%" />
	<br />
	<ion-spinner name="dots" color="secondary" style="scale: 150%;" />
</ion-grid>

<style>
	ion-grid {
		&.center-grid {
			position: absolute;
			top: 35%;
			display: block !important;
			width: 100%;
		}
	}
	.pop-up-image {
		transition: all ease-in-out 0.2s;
	}
</style>
