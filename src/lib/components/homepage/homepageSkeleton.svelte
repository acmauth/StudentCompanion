<script lang="ts">
</script>

<!-- Personal Section -->
<div class="skeleton-container">
	<!-- Header with avatar, greeting, and icons -->
	<div class="personal-section">
		<div class="info-container">
			<div class="header">
				<ion-thumbnail class="avatar-skeleton">
					<ion-skeleton-text animated />
				</ion-thumbnail>
				<div class="greeting-skeleton">
					<h5>
						<ion-skeleton-text animated style="width: 60%;" />
					</h5>
					<h5>
						<ion-skeleton-text animated style="width: 40%;" />
					</h5>
				</div>
			</div>
			<div class="icons-skeleton">
				<ion-skeleton-text animated style="width: 1.5rem; height: 1.5rem; border-radius: 50%;" />
				<ion-skeleton-text animated style="width: 1.5rem; height: 1.5rem; border-radius: 50%;" />
			</div>
		</div>

		<!-- Wallet Card -->
		<ion-card class="wallet-card-skeleton">
			<ion-card-content>
				<div class="wallet-header">
					<div>
						<ion-skeleton-text animated style="width: 70%; height: 1rem;" />
						<ion-skeleton-text animated style="width: 50%; height: 0.8rem; margin-top: 0.5rem;" />
					</div>
					<ion-skeleton-text animated style="width: 1.8rem; height: 1.8rem; border-radius: 50%;" />
				</div>
				<div class="stats-skeleton">
					<div class="stat-item">
						<ion-skeleton-text animated style="width: 100%; height: 0.7rem; margin-top: 0.5rem;" />
						<ion-skeleton-text animated style="width: 100%; height: 0.7rem; border-radius: 10px; margin-top: 0.5rem;" />
					</div>
					<div class="stat-item">
						<ion-skeleton-text animated style="width: 100%; height: 0.7rem; margin-top: 0.5rem;" />
						<ion-skeleton-text animated style="width: 100%; height: 0.7rem; border-radius: 10px; margin-top: 0.5rem;" />
					</div>
				</div>
			</ion-card-content>
		</ion-card>
	</div>

	<!-- Services Section -->
	<div class="services-section">
		<div class="service-buttons-skeleton">
			{#each { length: 2 } as _}
				<ion-card class="service-button-skeleton">
					<ion-card-content>
						<ion-skeleton-text animated style="width: 1.5rem; height: 1.5rem; border-radius: 50%;" />
						<ion-skeleton-text animated style="width: 60%; height: 0.875rem;" />
					</ion-card-content>
				</ion-card>
			{/each}
		</div>
	</div>

	<!-- Events Section -->
	<div class="events-section">
		<ion-skeleton-text animated style="width: 40%; height: 1.125rem; margin-bottom: 0.625rem;" />
		<div class="events-container-skeleton">
			{#each { length: 2 } as _}
				<ion-card class="event-card-skeleton">
					<ion-card-content>
						<div class="event-header-skeleton">
							<div class="event-left">
								<ion-skeleton-text animated style="width: 3rem; height: 1.2rem; border-radius: 0.3rem;" />
								<ion-skeleton-text animated style="width: 5rem; height: 0.75rem;" />
							</div>
							<ion-skeleton-text animated style="width: 1.1rem; height: 1.1rem; border-radius: 50%;" />
						</div>
						<ion-skeleton-text animated style="width: 80%; height: 1rem; margin-top: 0.5rem;" />
					</ion-card-content>
				</ion-card>
			{/each}
		</div>
	</div>

	<!-- Updates Section -->
	<div class="updates-section">
		<div class="updates-header">
			<ion-skeleton-text animated style="width: 30%; height: 1.125rem;" />
			<ion-skeleton-text animated style="width: 2rem; height: 2rem; border-radius: 50%;" />
		</div>
		{#each { length: 3 } as _}
			<ion-card class="update-card-skeleton">
				<ion-card-content>
					<ion-skeleton-text animated style="width: 70%; height: 1rem;" />
					<ion-skeleton-text animated style="width: 50%; height: 0.875rem; margin-top: 0.5rem;" />
				</ion-card-content>
			</ion-card>
		{/each}
	</div>
</div>

<style>
	.skeleton-container {
		background-color: var(--ion-background-color, #f5f5f5);
		min-height: 100vh;
	}

	.personal-section {
		padding: 0.5rem 1.5rem 1rem 1.5rem;
		background: linear-gradient(to bottom, transparent 70%, var(--ion-background-color, #f5f5f5) 70%);
	}

	.info-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.avatar-skeleton {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}

	.greeting-skeleton {
		flex: 1;
		padding: 0 0.5rem;
	}

	.greeting-skeleton h5 {
		margin: 0.25rem 0;
	}

	.icons-skeleton {
		display: flex;
		gap: 0.7rem;
		align-items: center;
	}

	.wallet-card-skeleton {
		margin: 0;
		border-radius: 1.3rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.wallet-card-skeleton ion-card-content {
		padding: 1.25rem;
	}

	.wallet-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.stats-skeleton {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.services-section {
		padding: 2.5rem 1.5rem 1.5rem 1.5rem;
		background-color: var(--ion-background-color, #f5f5f5);
	}

	.service-buttons-skeleton {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.service-button-skeleton {
		margin: 0;
		border-radius: 3rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.service-button-skeleton ion-card-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
	}

	.events-section {
		padding: 0 1.5rem 1.5rem 1.5rem;
		background-color: var(--ion-background-color, #f5f5f5);
	}

	.events-container-skeleton {
		border: 2px dashed var(--ion-color-medium-tint);
		border-radius: 1rem;
		padding: 0.625rem;
		background: var(--ion-color-light);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-card-skeleton {
		margin: 0;
		border-radius: 0.625rem;
		border: 1px solid var(--ion-color-light-shade);
	}

	.event-card-skeleton ion-card-content {
		padding: 0.625rem 0.75rem;
	}

	.event-header-skeleton {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.event-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.updates-section {
		padding: 0 1.5rem 1.5rem 1.5rem;
		background-color: var(--ion-background-color, #f5f5f5);
	}

	.updates-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.update-card-skeleton {
		margin: 0.5rem 0;
		border-radius: 0.625rem;
	}

	.update-card-skeleton ion-card-content {
		padding: 0.875rem;
	}
</style>
