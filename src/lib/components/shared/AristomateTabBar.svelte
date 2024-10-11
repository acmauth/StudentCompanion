<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { navigating, page } from '$app/stores';
	import { Keyboard } from '@capacitor/keyboard';
	import { goto } from '$app/navigation';

	export let ionTabsDidChange = () => {};
	export let ionTabsWillChange = () => {};
	export let slot = 'bottom';

	/**
      An array of tab objects containing label, icon, and tab properties.
      @type {{label: string; icon: string; tab: string;}[]}
      */
	export let tabs = [];

	let ionTabBarElement;
	let controller;
	let tabBarLine;

	// we need relative path for the goto to function properly and to allow for relative tab definitions
	const { pathname } = $page.url;
	const cleanedPath = pathname.replace(/\/+$/, ''); // Strip trailing slashes, so we can get the last part of the path correctly. (e.g. /pages/homepage/ -> /pages/homepage)
	const pathSplit = cleanedPath.split('/');
	let currentTabName = pathSplit[pathSplit.length - 1]; // we don't want to use at(-1) because of old browsers
	let relativePath = cleanedPath.replace(currentTabName, '');

	// we need to capture the router changes - to support a-href navigation and other stuff
	$: if ($navigating && $navigating.to) {
		tabs.forEach(async (tab) => {
			if ($navigating.to.url.pathname.includes(relativePath + tab.tab)) {
				currentTabName = tab.tab;
				await goto($navigating.to.url.pathname);
				controller.select(tab.tab);
				moveTabBarLine(tab.tab);
			}
		});
	}

	onMount(async () => {
		// reassignment needed after onMount
		controller = ionTabBarElement;
		tabBarLine = ionTabBarElement;
		controller.select(currentTabName);
		tabBarLine = document.querySelector('.tabBarLine2');

		// Calling the function twice to ensure the line is in the correct position
		// At first load the line is not in the correct position, so we use an approximation initially
		// and then we call the function again after a short delay to ensure the line is in the correct position
		moveTabBarLine(currentTabName);
		setTimeout(() => {
			moveTabBarLine(currentTabName);
		}, 5);
	});

	const tabBarClick = async (selectedTab) => {
		moveTabBarLine(selectedTab);
		currentTabName = selectedTab;
		await goto(relativePath + selectedTab);
		controller.select(selectedTab);
	};

	function moveTabBarLine(tab) {
		const tabButton = document.querySelector(`.tab_${tab}`);
		const tabButtonRect = tabButton.getBoundingClientRect();
		const tabBarLineWidth = tabBarLine.clientWidth ? tabBarLine.clientWidth : 16;
		const tabBar = document.querySelector('.tabbarmain');
		const parentWidth = tabButtonRect.width ? tabButtonRect.width : window.innerWidth / 5;

		const finalPosition = tabButtonRect.left + (parentWidth / 2 - tabBarLineWidth / 2);
		const initialPosition = tabButtonRect.left + parentWidth / 2;

		tabBarLine.style.transform = `translateX(${finalPosition}px)`;
	}

	// Keyboard listener to hide the tab bar line when the keyboard is open
	Keyboard.addListener('keyboardWillShow', () => {
		tabBarLine.style.display = 'none';
	});

	Keyboard.addListener('keyboardWillHide', () => {
		tabBarLine.style.display = 'block';
	});
</script>

<ion-tabs
	on:ionTabsDidChange={ionTabsDidChange}
	on:ionTabsWillChange={ionTabsWillChange}
	bind:this={ionTabBarElement}
>
	<slot />

	{#if slot === 'bottom' || slot === ''}
		<ion-tab-bar slot="bottom" class="tabbarmain">
			<div class="tabBarLine2" />
			{#each tabs as tab}
				<ion-tab-button
					aria-hidden
					class="tabbarbutton tab_{tab.tab}"
					tab={tab.tab}
					on:keydown={() => {
						tabBarClick(tab.tab);
					}}
					on:click={() => {
						tabBarClick(tab.tab);
					}}
				>
					<ion-label class="tabbarlabel">{tab.label}</ion-label>
					{#if tab.tab !== currentTabName && tab.iconUnselected}
						<ion-icon icon={tab.iconUnselected} class="tabbaricons" />
					{:else}
						<ion-icon icon={tab.icon} class="tabbaricons" />
					{/if}
				</ion-tab-button>
			{/each}
		</ion-tab-bar>
	{/if}
	{#if slot === 'top'}
		<ion-tab-bar slot="top">
			{#each tabs as tab}
				<ion-tab-button
					aria-hidden
					tab={tab.tab}
					on:keydown={() => {
						tabBarClick(tab.tab);
					}}
					on:click={() => {
						tabBarClick(tab.tab);
					}}
				>
					<ion-label>{tab.label}</ion-label>
					<ion-icon icon={tab.icon} class="tabbaricons" />
				</ion-tab-button>
			{/each}
		</ion-tab-bar>
	{/if}
</ion-tabs>

<style>
	.tabbaricons {
		font-size: x-large;
	}

	ion-tab-button {
		transition: all 0.3s ease;
	}

	.tabBarLine2 {
		background-color: var(--app-color-primary-dark);
		height: 4px;
		border-radius: 2rem;
		position: absolute;
		transition: 0.4s ease-in-out;
		bottom: 10px;
		/* z-index: 1000; */
		left: 0;
		width: 1rem;
	}
</style>
