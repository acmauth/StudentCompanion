<script lang="ts">
	export let linktitle = '';
	export let linkaddress = '';
	export let imagelink: string | null = null;

	function goToLinkaddress() {
		window.open(linkaddress, '_blank');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-card button on:click={goToLinkaddress}>
	<ion-item lines="none">
		{#if imagelink}
			<ion-thumbnail slot="start">
			<!-- svelte-ignore a11y-missing-attribute -->
				<img src={imagelink} />
			</ion-thumbnail>
		{/if}
		<ion-label class="ion-text-wrap">
			<ion-text color="primary">
				<h2><b>{linktitle}</b></h2>
			</ion-text>

			<p>{linkaddress}</p>
		</ion-label>
	</ion-item>
</ion-card>
