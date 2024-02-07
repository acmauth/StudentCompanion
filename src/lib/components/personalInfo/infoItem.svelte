<script>
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';
	import '../../../theme/variables.css';
	/**
	 * @type {string}
	 */
	 export let gender;
	/**
	 * @type {any}
	 */
	 export let username;
	/**
	 * @type {any}
	 */

	 export let familyName;
	/**
	 * @type {any}
	 */

	 export let givenName;
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
			<ion-item lines="none">
				<ion-card-subtitle>{aem}</ion-card-subtitle>
			</ion-item>
		</ion-card-header>
	</ion-card>
	<ion-card>
		<ion-card-content>
			{#if username}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.person} />

				<ion-label class="ion-padding-start">{username}</ion-label>
			</ion-item>
			{/if}

			{#if schoolGraduated}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.school} />

				<ion-label class="ion-padding-start">{schoolGraduated}</ion-label>
			</ion-item>
			{/if}

			{#if birthDate}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.calendar} />

				<ion-label class="ion-padding-start">{birthDate}</ion-label>
			</ion-item>
			{/if}

			{#if email}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.mail} />

				<ion-label class="ion-padding-start">{email}</ion-label>
			</ion-item>
			{/if}

			{#if gender}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.maleFemale} />

				<ion-label class="ion-padding-start">{gender === 'Α' ? 'Άντρας' : 'Γυναίκα'}</ion-label>
			</ion-item>
			{/if}


			{#if departmentName}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.location} />

				<ion-label class="ion-padding-start">{departmentName}</ion-label>
			</ion-item>
			{/if}

			{#if semester}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-label class="ion-padding-start">{semester}ο Εξάμηνο</ion-label>
			</ion-item>
			{/if}

			<ion-item lines="none" on:click={logOut}>
				<ion-icon color="danger" size="small" icon={allIonicIcons.exit} />

				<ion-label color="danger" class="ion-padding-start">Αποσύνδεση</ion-label>
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

	ion-icon {
		color: var(--ion-color-primary);
	}


	ion-card-subtitle {
		font-size: 1.2rem;
		padding-left: 5px;
	}
</style>