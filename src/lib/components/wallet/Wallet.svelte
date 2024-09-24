<script lang="ts">
    import { t } from "$lib/i18n";
    import { qrStore } from "./qrStore";
	import gym_id from '$lib/assets/qr/GYM_PLACEHOLDER.svg'
	import student_id from '$lib/assets/qr/ID_PLACEHOLDER.svg'
    
    export let qrModalOpen: boolean;

    let addQRAlertOpen: boolean = false;
    let addGym: boolean = false;
    let addSchool: boolean = false;
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
            <img src={student_id} alt="student id" on:click={()=>{addQRAlertOpen=true; addGym=false; addSchool = true;}} aria-hidden/>
            <p>{$t("homepage.schoolQR")}</p>
        </div>
        <div class="item">
            <img src={gym_id} alt="gym id" on:click={()=>{addQRAlertOpen=true; addGym=true; addSchool = false;}} aria-hidden>
            <p>{$t("homepage.gymQR")}</p>
        </div>
        </div>
    </div>
</ion-modal>


<ion-alert
    is-open={addQRAlertOpen}
    mode="ios"
    header="{$t('wallet.addQRTitle')}"
    message="{$t('wallet.addQRMessage')}"
    inputs={[
        {
            name: 'qr',
            type: 'number',
            placeholder: '20' + Math.floor(1000000000 + Math.random() * 9000000000).toString()
        }
    ]}
    buttons={[
        {
            text: 'Άκυρο',
            role: 'cancel',
            handler: () => {
                addQRAlertOpen = false;
            }
        },
        {
            text: 'Προσθήκη',
            handler: (alertData) => {
                if (addGym) {
                    $qrStore = $qrStore.push({"gym", alertData.qr});
                } else if (addSchool) {
                    // Add school QR
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
		display: flex;
		justify-content: space-around;  
		align-items: center;
	}

	.item {
		display: flex;
		flex-direction: column; 
		align-items: center;
	}

	.item img {
		width: 50%;
		margin-bottom: 10px; 
	}

	.item p {
		text-align: center;
	}
</style>