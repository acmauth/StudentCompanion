<script>
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
</script>

<IonPage>
	<ion-header>
		<ion-toolbar>
			<ion-title>Μενού Λέσχης</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<h1>Εβδομαδιαίο Μενού</h1>
		<ion-accordion-group>
			<ion-accordion value="first">
				<ion-item slot="header" color="light">
					<ion-label>Δευτέρα</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Monday Content</div>
			</ion-accordion>
			<ion-accordion value="second">
				<ion-item slot="header" color="light">
					<ion-label>Τρίτη</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Tuesday Content</div>
			</ion-accordion>
			<ion-accordion value="third">
				<ion-item slot="header" color="light">
					<ion-label>Τετάρτη</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Wednesday Content</div>
			</ion-accordion>
			<ion-accordion value="fourth">
				<ion-item slot="header" color="light">
					<ion-label>Πέμπτη</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Thursday Content</div>
			</ion-accordion>
			<ion-accordion value="fifth">
				<ion-item slot="header" color="light">
					<ion-label>Παρασκευή</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Friday Content</div>
			</ion-accordion>
			<ion-accordion value="sixth">
				<ion-item slot="header" color="light">
					<ion-label>Σάββατο</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Saturday Content</div>
			</ion-accordion>
			<ion-accordion value="seventh">
				<ion-item slot="header" color="light">
					<ion-label>Κυριακή</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">Sunday Content</div>
			</ion-accordion>
		</ion-accordion-group>
	</ion-content>
</IonPage>
