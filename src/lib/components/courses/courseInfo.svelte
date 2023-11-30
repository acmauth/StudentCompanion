<script>
	export let course;
	export let stats;
</script>

<ion-header>
	<ion-toolbar>
		<ion-title>Course Info</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<ion-card>
		<ion-card-header>
			<ion-card-title>{course.title}</ion-card-title>
			<ion-card-subtitle>{course.code}</ion-card-subtitle>
			<ion-card-subtitle>{course.courseType}</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="ion-text-center">
			{#if !stats.grade}
				<ion-text color="danger">Δεν έχεις βαθμολογήθει ακόμα στο μάθημα</ion-text>
			{:else if stats.grade * 10 >= 5}
				<circle-progress class="passed" max={10} value={stats.grade} />
			{:else}
				<circle-progress class="failed" max={10} value={stats.grade} />
			{/if}

			<ion-list>
				<ion-item>
					<ion-label>ECTS</ion-label>
					<ion-text slot="end">{course.ects}</ion-text>
				</ion-item>
				<ion-item>
					<ion-text>Διδάσκοντες</ion-text>
					<ul>
						{#each course.teacher as teacher}
							<ion-text slot="end">{teacher}</ion-text>
						{/each}
					</ul>
				</ion-item>

				<ion-item>
					<ion-label>Εξάμηνο</ion-label>
					<ion-text slot="end">{course.semester}ο</ion-text>
				</ion-item>
				<ion-item>
					<ion-label>Περίοδος</ion-label>
					<ion-text slot="end">{course.season}</ion-text>
				</ion-item>
				<ion-item>
					<ion-label>Εβδομαδιαίες ώρες</ion-label>
					<ion-text slot="end">{course.weeklyHours}</ion-text>
				</ion-item>
			</ion-list>
		</ion-card-content>
	</ion-card>

	<ion-card>
		<ion-card-header>
			<ion-card-title>Στατιστικά</ion-card-title>
			{#if course.period}
			<ion-card-subtitle>Εξεταστική {course.period}</ion-card-subtitle>
			{:else}
			<ion-card-subtitle>-</ion-card-subtitle>
			{/if}
		</ion-card-header>
		{#if stats.grade}
		<ion-list>
			<ion-item>
				<ion-label>Βαθμολογημένοι</ion-label>
				<ion-text slot="end">{stats.totalStudents}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές με ίδιο βαθμό</ion-label>
				<ion-text slot="end">{stats.studentsLikeMe}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές με καλύτερο βαθμό</ion-label>
				<ion-text slot="end">{stats.studentsBetterThanMe}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές με χειρότερο βαθμό</ion-label>
				<ion-text slot="end">{stats.studentsWorseThanMe}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές που πέρασαν</ion-label>
				<ion-text slot="end">{stats.passedCount}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές που κόπηκαν</ion-label>
				<ion-text slot="end">{stats.failedCount}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Μέσος όρος</ion-label>
				<ion-text slot="end">{stats.averageGrade}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Μέσος όρος επιτυχόντων</ion-label>
				<ion-text slot="end">{stats.averageGradePassed}</ion-text>
			</ion-item>
		</ion-list>
		{:else}
		<ion-list>
			<ion-item>
				<ion-text class="ion-padding" color="danger">Δεν υπάρχουν στατιστικά για την εξεταστική ακόμη</ion-text>
			</ion-item>
			
		</ion-list>
		
		{/if}
	</ion-card>

	<canvas id="gradeChart" />
</ion-content>

<style>
	circle-progress::part(base) {
		width: 120px;
		height: auto;
	}

	.passed::part(value) {
		stroke: #2dd36f;
	}
	.failed::part(value) {
		stroke: #eb445a;
	}
</style>