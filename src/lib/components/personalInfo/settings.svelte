<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	
	/**
	 * @type {any}
	 */
	 export let logOut;

	function sentAnalytics() {
		// Send subjects json to the server for debugging
	
		const url = 'https://analytics.neron.dev/v1/analytics';
		
		let examkeys = Object.keys(localStorage).filter(key => key.includes('universis_students/me/exams'));
		let keys = ['universis_students/me/courses?$top=-1','universis_students/me/grades?$filter=courseExam/year eq 2023 and courseExam/examPeriod eq 1&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false',...examkeys];
		
		let file = {'medata': [	JSON.parse(localStorage.getItem('universis_Students/me/')).value.semester, 
								JSON.parse(localStorage.getItem('universis_Students/me/department')).value.abbreviation ]
					};
	
		keys.forEach(key => {
			file[key] = localStorage.getItem(key);
		});
	
		console.log(file);
		let options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'},
			body: JSON.stringify(file),
		};
		fetch(url, options)
			.then((response) => {
				if (!response.ok) {
				throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Response:', data);
			})
			.catch((error) => {
				console.error('There was a problem with the fetch operation:', error);
			});
		};
</script>

<ion-card>
	<ion-card-content>

		<ion-item button href="/about">
			<ion-icon size="small" icon={allIonicIcons.people} />
			<ion-label class="ion-padding-start">Σχετικά με εμάς</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
			
		</ion-item>

		<!-- <ion-item button>
			<ion-icon size="small" icon={allIonicIcons.brush} />
			<ion-label class="ion-padding-start">Change Theme</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		</ion-item> -->

		<ion-item button href="/faq">
			<ion-icon size="small" icon={allIonicIcons.helpCircle} />
			<ion-label class="ion-padding-start">FAQ</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		</ion-item>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<ion-item button on:click={sentAnalytics}>
			<ion-icon size="small" icon={allIonicIcons.paperPlane} />
			<ion-label class="ion-padding-start">Αποστολή analytics</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		</ion-item>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<ion-item button lines="none" on:click={logOut}>
			<ion-icon color="danger" size="small" icon={allIonicIcons.exit} />
			
			<ion-label color="danger" class="ion-padding-start">Αποσύνδεση</ion-label>
			<ion-icon color="danger" size="small" icon={allIonicIcons.chevronForwardCircle} />
			
		</ion-item>

		</ion-card-content>

	</ion-card>



	<style>

	ion-icon {
		color: var(--app-color-primary-dark);
	}

	</style>
 