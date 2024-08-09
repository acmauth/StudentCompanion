<script>
    import {navController} from '$shared/StackedNav'
    import SubPageHeader from '$components/shared/subPageHeader.svelte';
    export let prop = 'prop';

    function goBack() {
        navController.pop();
    }
</script>

<!-- <ion-header translucent>
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-back-button text="Back off!" default-href="/" color="success" />
            <ion-button on:click={goBack}>Back!</ion-button>
		</ion-buttons>
		<ion-title>{prop}</ion-title>
	</ion-toolbar>
</ion-header> -->


<ion-content fullscreen>
    <SubPageHeader title="Course" subtitle="This is a course!" stackedNav/>
    <p>Comp!</p>
    <p>Prop: {prop}</p>
</ion-content>