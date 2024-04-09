<script>
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';

	/**
	 * @type {string}
	 */
	 export let gender;
	/**
	 * @type {string}
	 */
	 export let username;
	/**
	 * @type {string}
	 */

	 export let familyName;
	/**
	 * @type {string}
	 */

	 export let givenName;
	/**
	 * @type {string}
	 */
	 export let aem;
	 /**
	 * @type {string}
	 */
	 export let apm;
	/**
	 * @type {string}
	 */
	 export let schoolGraduated;
	/**
	 * @type {string}
	 */
	 export let birthDate;
	/**
	 * @type {string}
	 */
	 export let email;

	/**
	 * @type {string}
	 */
	 export let departmentName;
	/**
	 * @type {string}
	 */
	 export let semester;
	 /**
	 * @type {string}
	 */
</script>


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

			{#if apm}
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.idCard} />

				<ion-label class="ion-padding-start">{apm}</ion-label>
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
			<ion-item lines="none">
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-label class="ion-padding-start">{semester}ο Εξάμηνο</ion-label>
			</ion-item>
			{/if}


	</ion-card>
	



<style>
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	ion-icon {
		color: var(--app-color-primary-dark);
	}


	ion-card-subtitle {
		font-size: 1.2rem;
		padding-left: 5px;
	}
</style>