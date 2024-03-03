<script lang="ts">
</script>

<ion-item style="margin:1.5rem; height: 5rem" lines="none">
	<ion-thumbnail slot="start">
		<ion-skeleton-text animated />
	</ion-thumbnail>
	<ion-label>
		<h5>
			<ion-skeleton-text animated style="width: 50%;" />
		</h5>
		<h5>
			<ion-skeleton-text animated style="width: 70%;" />
		</h5>
	</ion-label>
	<!-- <ion-thumbnail slot="end">
		<ion-skeleton-text animated />
	</ion-thumbnail> -->
</ion-item>
<div style="margin:1rem; display: grid; grid-template-columns: 1.5fr 1fr; height:6rem">
	<ion-card>
		<ion-item lines="none">
			<ion-label>
				<h2>
					<ion-skeleton-text animated style="width: 30%" />
				</h2>
				<p>
					<ion-skeleton-text animated style="width: 80%" />
				</p>
			</ion-label>
		</ion-item>
	</ion-card>

	<ion-card>
		<ion-item lines="none">
			<ion-label>
				<h2>
					<ion-skeleton-text animated style="width: 30%" />
				</h2>
				<p>
					<ion-skeleton-text animated style="width: 80%" />
				</p>
			</ion-label>
		</ion-item>
	</ion-card>
</div>

<ion-item style="margin:1rem" lines="none">
	<ion-label>
		<p>
			<ion-skeleton-text animated style="width: 30%;" />
		</p>
	</ion-label>
</ion-item>

<div style="margin:1rem; display: grid; grid-template-columns: 1fr 1fr 1fr; height:6rem">
	{#each { length: 3 } as i}
		<ion-card>
			<ion-item lines="none">
				<ion-label>
					<h2>
						<ion-skeleton-text animated style="width: 30%" />
					</h2>
					<p>
						<ion-skeleton-text animated style="width: 80%" />
					</p>
				</ion-label>
			</ion-item>
		</ion-card>
	{/each}
</div>

<ion-item style="margin:1rem" lines="none">
	<ion-label>
		<p>
			<ion-skeleton-text animated style="width: 30%;" />
		</p>
	</ion-label>
</ion-item>

{#each { length: 3 } as i}
	<ion-card style="margin:1rem">
		<ion-item lines="none">
			<ion-label>
				<h3 style="display: flex; flex-direction: row">
					<ion-skeleton-text animated style="width: 60%" />
				</h3>
				<p>
					<ion-skeleton-text animated style="width: 40%" />
				</p>
			</ion-label>
		</ion-item>
	</ion-card>
{/each}
