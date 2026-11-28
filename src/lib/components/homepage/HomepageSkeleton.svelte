<script lang="ts">
</script>

<div class="skeleton-container">
	<!-- Personal Section: greeting + avatar -->
	<div class="personal-section">
		<div class="info-container">
			<div class="header">
				<div class="greeting-skeleton">
					<ion-skeleton-text animated style="width: 55%; height: 0.85rem;" />
					<ion-skeleton-text animated style="width: 75%; height: 1.1rem; margin-top: 0.5rem;" />
				</div>
			</div>
			<div class="avatar-skeleton-container">
				<ion-skeleton-text animated style="width: 3rem; height: 3rem; border-radius: 50%;" />
			</div>
		</div>

		<!-- Wallet Card -->
		<div class="wallet-card-skeleton">
			<div class="card-header">
				<div class="department-info">
					<ion-skeleton-text animated style="width: 60%; height: 0.9rem;" />
					<ion-skeleton-text animated style="width: 80%; height: 0.75rem; margin-top: 0.5rem;" />
				</div>
				<ion-skeleton-text animated style="width: 1.8rem; height: 1.8rem; border-radius: 0.75rem;" />
			</div>
			<div class="stats-container">
				<div class="stat-item">
					<ion-skeleton-text animated style="width: 3.25rem; height: 3.25rem; border-radius: 50%; flex-shrink: 0;" />
					<div class="stat-text">
						<ion-skeleton-text animated style="width: 2.5rem; height: 0.9rem;" />
						<ion-skeleton-text animated style="width: 3.5rem; height: 0.7rem; margin-top: 0.35rem;" />
					</div>
				</div>
				<div class="stat-item">
					<ion-skeleton-text animated style="width: 3.25rem; height: 3.25rem; border-radius: 50%; flex-shrink: 0;" />
					<div class="stat-text">
						<ion-skeleton-text animated style="width: 2.5rem; height: 0.9rem;" />
						<ion-skeleton-text animated style="width: 3.5rem; height: 0.7rem; margin-top: 0.35rem;" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Services Section -->
	<div class="services-section">
		<div class="service-buttons-grid">
			{#each { length: 3 } as _}
				<div class="service-button-skeleton">
					<ion-skeleton-text animated style="width: 1.5rem; height: 1.5rem; border-radius: 50%;" />
				</div>
			{/each}
		</div>
	</div>

	<!-- Events / No-events Section -->
	<div class="no-events-skeleton">
		<div class="no-events-info">
			<ion-skeleton-text animated style="width: 2.5rem; height: 2.5rem; border-radius: 50%; flex-shrink: 0;" />
			<ion-skeleton-text animated style="width: 8rem; height: 0.95rem;" />
		</div>
		<ion-skeleton-text animated style="width: 5.5rem; height: 2rem; border-radius: 0.6rem; flex-shrink: 0;" />
	</div>

	<!-- Updates Section -->
	<div class="updates-section">
		<div class="updates-header">
			<ion-skeleton-text animated style="width: 30%; height: 1.125rem;" />
			<ion-skeleton-text animated style="width: 1.6rem; height: 1.6rem; border-radius: 50%;" />
		</div>
		<div class="timeline-skeleton">
			{#each { length: 2 } as _}
				<div class="tl-row-skeleton">
					<ion-skeleton-text animated style="width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;" />
					<div class="course-details-skeleton">
						<ion-skeleton-text animated style="width: 70%; height: 0.9rem;" />
						<ion-skeleton-text animated style="width: 40%; height: 0.7rem; margin-top: 0.4rem;" />
					</div>
					<ion-skeleton-text animated style="width: 2rem; height: 1.5rem; border-radius: 0.7rem; flex-shrink: 0;" />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.skeleton-container {
		padding-top: 0.5rem;
	}

	/* Personal section */
	.info-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.header {
		flex: 1;
	}

	.greeting-skeleton {
		padding-left: 0.2rem;
	}

	.avatar-skeleton-container {
		padding: 4px;
		flex-shrink: 0;
	}

	/* Wallet card */
	.wallet-card-skeleton {
		background: var(--app-color-map-input);
		border-radius: 1.3rem;
		padding: 1.25rem;
		margin: 1.5rem 0;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.department-info {
		flex: 1;
	}

	.stats-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.stat-text {
		flex: 1;
	}

	/* Services section */
	.services-section {
		margin-bottom: 1.5rem;
	}

	.service-buttons-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
	}

	.service-button-skeleton {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1rem;
		border-radius: 3rem;
		background: var(--app-color-map-input);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	/* No-events skeleton */
	.no-events-skeleton {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-block: 2rem;
	}

	.no-events-info {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	/* Updates section */
	.updates-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.timeline-skeleton {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.tl-row-skeleton {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.course-details-skeleton {
		flex: 1;
		min-width: 0;
	}
</style>
