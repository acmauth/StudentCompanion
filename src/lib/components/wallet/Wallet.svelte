<script lang="ts">
    import { t } from "$lib/i18n";
    import { qrStore } from "./qrStore";
	import gym_id from '$lib/assets/qr/GYM_PLACEHOLDER.svg'
	import student_id from '$lib/assets/qr/ID_PLACEHOLDER.svg'
    import { qr } from '@svelte-put/qr/svg';
	import { getElement } from "ionicons/dist/types/stencil-public-runtime";

    export let qrModalOpen: boolean;

    let addQRAlertOpen: boolean = false;
    let editQRAlertOpen: boolean = false;
    let qr_value: string | null = null;

    let gymQRPressed: boolean = false;
    let schoolQRPressed: boolean = false;
</script>



<ion-modal
    is-open={qrModalOpen}
    initial-breakpoint={1}
    on:ionModalDidDismiss={() => {qrModalOpen = false;}}
    breakpoints={[0, 1]}
    style="--height:auto;">
    <div style="width: 100%; height: 30%; display: flex; align-items: center; justify-content: center;">
        <div class="container">
        <div class="item">
            {#if $qrStore.filter((item) => item.title === "school").length > 0}
                <svg 
                    use:qr={{
                        data: $qrStore.filter((item) => item.title === "school")[0].data,
                        shape: 'circle'
                    }}
                    on:click={()=>{editQRAlertOpen=true; gymQRPressed=false; schoolQRPressed = true;}} 
                    aria-hidden
                />
            {:else}
                <img src={student_id} alt="student id" on:click={()=>{addQRAlertOpen=true; gymQRPressed=false; schoolQRPressed = true;}} aria-hidden/>
            {/if}
            <p>{$t("homepage.schoolQR")}</p>
        </div>
        <div class="item">
            {#if $qrStore.filter((item) => item.title === "gym").length > 0}
                <svg
                    use:qr={{
                        data: $qrStore.filter((item) => item.title === "gym")[0].data,
                        shape: 'circle'
                    }}
                    on:click={()=>{editQRAlertOpen=true; gymQRPressed=true; schoolQRPressed = false;}}
                    aria-hidden
                />
            {:else}
                <img src={gym_id} alt="gym id" on:click={()=>{addQRAlertOpen=true; gymQRPressed=true; schoolQRPressed = false;}} aria-hidden>
            {/if}
            <p>{$t("homepage.gymQR")}</p>
        </div>
        </div>
    </div>
</ion-modal>


<ion-alert
    is-open={editQRAlertOpen}
    mode="ios"
    header="{$t('wallet.removeTitle')}"
    message="{$t('wallet.removalMessage')}"
    buttons={[
        {
            text: $t('wallet.cancel'),
            role: 'cancel',
            handler: () => {
                editQRAlertOpen = false;
            }
        },
        {
            text: $t('wallet.remove'),
            handler: () => {
                if (gymQRPressed) {
                    $qrStore = $qrStore.filter((item) => item.title != "gym");
                } else if (schoolQRPressed) {
                    $qrStore = $qrStore.filter((item) => item.title != "school");
                }
               
                editQRAlertOpen = false;
            }
        }
    ]}
></ion-alert>

<ion-alert
    is-open={addQRAlertOpen}
    on:ionAlertWillDismiss={() => {qr_value = "";}}
    mode="ios"
    header="{$t('wallet.addQRTitle')}"
    message="{$t('wallet.addQRMessage')}"
    inputs={[
        {
            id: 'qr-input',
            name: 'qr',
            type: 'number',
            placeholder: '20' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            value: qr_value
        }
    ]}
    buttons={[
        {
            text: $t('wallet.cancel'),
            role: 'cancel',
            handler: () => {
                addQRAlertOpen = false;
            }
        },
        {
            text: $t('wallet.add'),
            handler: (alertData) => {
                if (gymQRPressed) {
                    $qrStore = $qrStore.concat([{title:"gym", data: alertData.qr}]);
                } else if (schoolQRPressed) {
                    $qrStore = $qrStore.concat([{title:"school", data: alertData.qr}]);
                }
                addQRAlertOpen = false;
            }
        }
    ]}
></ion-alert>


<style>
    .container {
		margin-top: 1rem;
		padding-block-start: 1.5rem;
        padding-block-end: 0.5rem;
        padding-inline: 1rem;
		display: flex;
		justify-content: space-around;  
		align-items: center;
	}

	.item {
        width: 50%;
		display: flex;
		flex-direction: column; 
		align-items: center;
        justify-content:space-between;
	}

	.item img {
		width: 50%;
		margin-bottom: 10px; 
	}
    
    .item svg {
		width: 100%;
	}

	.item p {
		text-align: center;
	}

</style>