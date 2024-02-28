<script lang="ts">
</script>

<div>
	<h5>
		<ion-skeleton-text animated style="width: 50%; margin:auto" />
	</h5>
</div>

<ion-item lines="none">
	<ion-label>
		<h1 style="height:2rem">
			<ion-skeleton-text animated style="width: 50%" />
		</h1>
	</ion-label>
</ion-item>

<ion-card>
	<ion-item lines="none">
		<ion-label>
			<h5>
				<ion-skeleton-text animated style="width: 50%" />
			</h5>
			<p>
				<ion-skeleton-text animated style="width: 80%" />
			</p>

			&nbsp;

			<h5>
				<ion-skeleton-text animated style="width: 50%" />
			</h5>
			<p>
				<ion-skeleton-text animated style="width: 80%" />
			</p>

			&nbsp;

			<h5>
				<ion-skeleton-text animated style="width: 50%" />
			</h5>
			<p>
				<ion-skeleton-text animated style="width: 80%" />
			</p>
		</ion-label>
	</ion-item>
</ion-card>

<ion-item lines="none">
	<ion-label>
		<h1 style="height:2rem">
			<ion-skeleton-text animated style="width: 50%" />
		</h1>
	</ion-label>
</ion-item>

<ion-accordion-group expand="inset">
	{#each { length: 7 } as i}
		<ion-accordion value="first">
			<ion-item slot="header">
				<ion-label>
					<ion-skeleton-text animated style="width: 50%" />
				</ion-label>
			</ion-item>
		</ion-accordion>
	{/each}
</ion-accordion-group>
