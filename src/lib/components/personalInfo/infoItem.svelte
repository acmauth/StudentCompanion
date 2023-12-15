<script>
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';
	/**
	 * @type {string}
	 */
	 export let gender;
	/**
	 * @type {any}
	 */
	 export let givenName;
	/**
	 * @type {any}
	 */
	 export let familyName;
	/**
	 * @type {any}
	 */
	 export let aem;
	/**
	 * @type {any}
	 */
	 export let schoolGraduated;
	/**
	 * @type {any}
	 */
	 export let birthDate;
	/**
	 * @type {any}
	 */
	 export let email;

	/**
	 * @type {any}
	 */
	 export let departmentName;
	/**
	 * @type {any}
	 */
	 export let departmentAddress;
	/**
	 * @type {any}
	 */
	 export let semester;
	 /**
	 * @type {any}
	 */
	  export let logOut;
</script>



<ion-content>
	<ion-card class="ion-padding">
		<ion-card-header class="ion-text-center info">
			{#if gender === 'Α'}
				<img class="avatar ion-padding-vertical" alt="man" src={man} width="60px" />
			{:else}
				<img class="avatar ion-padding-vertical" alt="man" src={woman} width="60px" />
			{/if}
			<ion-card-title>{givenName} {familyName}</ion-card-title>
		</ion-card-header>
	</ion-card>
	<ion-card>
		<ion-card-content>
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.pricetag} />
				<ion-text class="ion-padding-start">{aem}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.person} />

				<ion-text class="ion-padding-start">{givenName} {familyName}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.school} />

				<ion-text class="ion-padding-start">{schoolGraduated}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.calendar} />

				<ion-text class="ion-padding-start">{birthDate}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.mail} />

				<ion-text class="ion-padding-start">{email}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.maleFemale} />

				<ion-text class="ion-padding-start">{gender === 'Α' ? 'Άντρας' : 'Γυναίκα'}</ion-text>
			</ion-item>


			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.location} />

				<ion-text class="ion-padding-start">{departmentName} {departmentAddress}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-text class="ion-padding-start">{semester}ο Εξάμηνο</ion-text>
			</ion-item>

			<ion-item on:click={logOut}>
				<ion-icon color="danger" size="small" icon={allIonicIcons.exit} />

				<ion-text color="danger" class="ion-padding-start">Αποσύνδεση</ion-text>
			</ion-item>


		</ion-card-content>
	</ion-card>
</ion-content>



<style>
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>