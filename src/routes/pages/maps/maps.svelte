<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { getMetroInfo } from '$lib/metroScraper/scraper';
	import * as allIonicIcons from 'ionicons/icons';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import gym from '$lib/assets/gym.png';
	import university from '$lib/assets/university.png';
	import library from '$lib/assets/library.png';
	import lesxi from '$lib/assets/lesxi.png';
	import ceremony from '$lib/assets/ceremony.png';
	import observatory from '$lib/assets/observatory.png';
	import metro from '$lib/assets/metro.png';
	import bus from '$lib/assets/bus.png';
	import coordinates from '$lib/components/map/coordinates.json';
	import Fuse from 'fuse.js';
	import osethLogo from '$lib/assets/oseth.svg';
	import campusSafetyLogo from '$lib/assets/campus-safety.png';
	import { t, locale, locales, getLocale } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { registerPlugin } from '@capacitor/core';

	// Register the custom AppLauncher plugin
	const AppLauncherPlugin = registerPlugin('AppLauncherPlugin');

	let points = coordinates;
	let filteredPoints = points;

	let mapElement;
	let map;
	let searchQuery = '';
	let metroInfo = '';
	let lang = getLocale();
	let isDarkMode = false;

	async function handleTransportAppClick() {
		const packageName = 'com.amco.city.thessaloniki';
		const iosAppStoreUrl = 'https://apps.apple.com/gr/app/oseth-bus/id6748433667';
		const fallbackUrl = 'https://telematics.oasth.gr/en/#main';

		const ua = navigator.userAgent || navigator.vendor || window.opera;
		const isAndroid = /android/i.test(ua);
		const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

		if (isAndroid) {
			try {
				// Try to launch the app directly using our custom plugin
				const result = await AppLauncherPlugin.launchApp({packageName});
				
				if (!result.launched) {
					// App not installed, go to fallback URL
					window.location.href = fallbackUrl;
				}
			} catch (err) {
				console.error('Error launching app:', err);
				window.location.href = fallbackUrl;
			}
		} else {
			// Non-mobile devices always go to telematics URL
			window.location.href = fallbackUrl;
		}
	}

	async function handleCampusSafetyClick() {
		const packageName = 'gr.auth.android.incidentmanager';
		const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=el`;

		const ua = navigator.userAgent || navigator.vendor || window.opera;
		const isAndroid = /android/i.test(ua);

		if (isAndroid) {
			try {
				// Try to launch the app directly using our custom plugin
				const result = await AppLauncherPlugin.launchApp({ packageName });
				
				if (!result.launched) {
					// App not installed, open Play Store
					window.location.href = `market://details?id=${packageName}`;
				}
			} catch (err) {
				console.error('Error launching app:', err);
				window.location.href = `market://details?id=${packageName}`;
			}
		} else {
			// For other platforms, go to Play Store
			window.location.href = playStoreUrl;
		}
	}


	onMount(async () => {
		if (browser) {
			isDarkMode = document.body.classList.contains('dark');
			const leaflet = await import('leaflet');

			// Use colorful OpenStreetMap view
			map = leaflet
				.map(mapElement, { zoomControl: false })
				.setView([40.63182425082954, 22.959049527401312], 15);
			leaflet
				.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				})
				.addTo(map);

			renderMarkers();

			metroInfo = await getMetroInfo();
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});

	function normalizeString(str) {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	function renderMarkers() {
		map.eachLayer((layer) => {
			if (layer instanceof L.Marker) {
				map.removeLayer(layer);
			}
		});

		for (const point of filteredPoints) {
			const { name_en, name_el, coordinates, pointer, url } = point;

			let popupContent;

			if (lang == 'en') {
				popupContent = `${name_en}<br><a href=${url}> ${url} </a>`;
			} else {
				popupContent = `${name_el}<br><a href=${url}> ${url} </a>`;
			}

			let iconUrl;
			if (pointer == 'department') {
				iconUrl = university;
			} else if (pointer == 'gym') {
				iconUrl = gym;
			} else if (pointer == 'lesxi') {
				iconUrl = lesxi;
			} else if (pointer == 'library') {
				iconUrl = library;
			} else if (pointer == 'observatory') {
				iconUrl = observatory;
			} else if (pointer == 'ceremony') {
				iconUrl = ceremony;
			} else if (pointer == 'metro') {
				iconUrl = metro;
			} else if (pointer == 'bus') {
				iconUrl = bus;
			}

			let customIconSize = [38, 38];
			let customIconAnchor = [19, 38];
			let customPopupAnchor = [0, -38];

			// bus and metro points need to be smaller
			if (pointer == 'metro' || pointer == 'bus') {
				customIconSize = [30, 30];
				customIconAnchor = [15, 30];
				customPopupAnchor = [0, -30];
			}
			const customIcon = L.icon({
				iconUrl: iconUrl,
				iconSize: customIconSize,
				iconAnchor: customIconAnchor,
				popupAnchor: customPopupAnchor
			});

			const marker = L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(map);
			marker.bindPopup(popupContent);

			// Only bind popup and open if searchQuery is not empty
			if (searchQuery.trim() !== '') {
				marker.bindPopup(popupContent).openPopup();
			}
		}
	}

	function handleSearch(event) {
		const searchQuery = normalizeString(event.target.value.trim().toLowerCase());

		if (searchQuery === '' || searchQuery === ' ') {
			filteredPoints = points;
			map.closePopup();
		} else {
			let key;
			if (lang == 'en') {
				key = 'name_en';
			} else {
				key = 'name_el';
			}

			const fuse = new Fuse(points, {
				keys: [key],
				threshold: 0.3,
				includeScore: true
			});

			// Perform the search
			const results = fuse.search(searchQuery);

			// Find the best point based on the score provided by Fuse.js
			const bestPoint = results.reduce((acc, curr) => {
				return (curr?.score || Infinity) < (acc?.score || Infinity) ? curr : acc;
			});

			// Open popup for the marker corresponding to the first occurrence of the search query
			if (bestPoint) {
				const { coordinates, name_el, name_en, url } = bestPoint.item;
				let variable;
				if (lang == 'en') {
					variable = name_en;
				} else {
					variable = name_el;
				}

				const popupContent = `${variable}<br><a href=${url}> ${url} </a>`;

				map.eachLayer((layer) => {
					if (layer instanceof L.Marker && layer.getLatLng().equals(coordinates)) {
						layer.bindPopup(popupContent).openPopup();
					}
				});
			}
		}
	}
</script>

<ion-tab tab="maps" />

<ion-page>
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode="md">
            <ion-title size="large">{$t('maps.title')}</ion-title>
        </ion-toolbar>
    </ion-header>
    <div class="search-container">
		<input type="text" placeholder="Search..." on:input={handleSearch} class="search-input" />
	</div>

	<div bind:this={mapElement} class="map-container" />

	<div class="footer-section">
		<div class="marquee-container">
			<div class="marquee-text" class:dark={isDarkMode}>
				{#if isDarkMode}
					Metro: {metroInfo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}
				{:else}
					<strong>Metro:</strong> {metroInfo}
				{/if}
			</div>
		</div>

		<div class="button-container">
			<div style="width:0.5rem; align-self:stretch; background-color:grey; margin:0.18rem;" />

			<ion-card
				on:click={handleTransportAppClick}
				class="button-card"
				aria-label="OASTH Transport Services"
				aria-hidden
			>
				<img src={osethLogo} alt="OSETH services" class="button-image" />
			</ion-card>

			<ion-card
				on:click={handleCampusSafetyClick}
				class="button-card"
				style="background-color: #3F4953;"
				aria-label="Campus Safety App"
				aria-hidden
			>
				<img src={campusSafetyLogo} alt="Campus safety information" class="button-image" />
			</ion-card>
		</div>
	</div>
</ion-page>

<style>
	@import 'leaflet/dist/leaflet.css';
	@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

	.search-container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		background-color: var(--app-color-map-input);
		border-radius: 100px;
		box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
		padding: 5px;
		width: 80%;
		max-width: 300px;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		padding: 10px;
		font-size: 16px;
		border-radius: 100px;
		background-color: var(--app-color-map-input);
		color: var(--app-color-map-input-text);
	}

	.map-container {
		position: relative;
		height: calc(100vh);
	}

	.footer-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: fit-content;
		background-color: var(--ion-color-light);
		display: flex;
		align-items: center;
		z-index: 1000;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.marquee-container {
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		position: relative;
	}

	.marquee-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	}

	.marquee-text {
		display: inline-block;
		width: auto;
		padding-block: 0.8rem;
		padding-inline: 0.8rem;
		animation: marquee 15s linear infinite;
		position: relative;
		z-index: 2;
		font-size: 0.9rem;
		color: var(--ion-text-color, #000);
	}

	.marquee-text.dark {
		color: #ff8c00;
		font-family: 'Press Start 2P', monospace;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-shadow: 0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 140, 0, 0.4),
			0 0 30px rgba(255, 140, 0, 0.2);
		text-transform: uppercase;
	}

	.marquee-text strong {
		color: var(--ion-text-color, #000);
	}

	.marquee-text.dark strong {
		color: #ffa500;
		letter-spacing: 0.1em;
		text-shadow: 0 0 10px rgba(255, 165, 0, 1), 0 0 20px rgba(255, 165, 0, 0.6);
	}

	@keyframes marquee {
		0% {
			transform: translateX(50%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
	.button-container {
		min-width: 10%;
		height: 100%;
		display: flex;
		justify-content: end;
		gap: 0.3rem;
		align-items: end;
		padding: 0.3rem;
	}

	.button-card {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: end;
		justify-content: end;
		margin: 0;
		padding: 0;
		background-color: white;
		border-color: grey;
		border-width: 0.1rem;
		border-style: solid;
		max-height: 60px;
		max-width: 60px;
	}

	.button-image {
		width: 100%;
		height: 100%;
		object-fit:contain;
		aspect-ratio: 1;
	}
</style>
