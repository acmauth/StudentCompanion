<script lang="ts">
	interface Props {
		linktitle?: string;
		linkaddress?: string;
		imagelink?: string | null;
	}

	let { linktitle = '', linkaddress = '', imagelink = null }: Props = $props();

	function goToLinkaddress() {
		window.open(linkaddress, '_blank');
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<ion-card button onclick={goToLinkaddress}>
	<ion-item lines="none">
		{#if imagelink}
			<ion-thumbnail slot="start">
			<!-- svelte-ignore a11y_missing_attribute -->
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
