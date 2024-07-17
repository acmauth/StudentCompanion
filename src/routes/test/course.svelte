<script>
    import {navController} from 'ionic-svelte'
    export let prop = 'prop';

    function goBack() {
        navController.pop();
    }
</script>

<ion-header translucent>
	<ion-toolbar>
		<ion-buttons slot="start">
			<!-- <ion-back-button text="Back off!" default-href="/" color="success" /> -->
            <ion-button on:click={goBack}>Back!</ion-button>
		</ion-buttons>
		<ion-title>{prop}</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen>
    <p>Comp!</p>
    <p>Prop: {prop}</p>
</ion-content>