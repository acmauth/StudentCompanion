<script>
    import darkIcon from "./icon_dark.png";
    import lightIcon from "./icon_light.png";
    import CredentialLogin from "../CredentialLogin.svelte";
	import { userCredsFlag as autheticationFlag} from '$components/webmailLogin/userCredsFlagStore';

    let inlineModalOpen = false;
    let breakpoints = [0, 0.5, 1];
    const inlineModalDismissed = (val) => {
        inlineModalOpen = false;
    };

</script>

{#if !$autheticationFlag}
    <ion-card href="" aria-hidden on:click ={() => {inlineModalOpen = true}}>
        <div class="mainContents">
            <img src={darkIcon} alt="Dark Icon" class="icon darkIcon"/>
            <img src={lightIcon} alt="Light Icon" class="icon lightIcon"/>
            <div class="ComingSoonContainer">
                <ion-title class="cardTitle">Webmail | e-learning</ion-title>
                <ion-subtitle>Ολοκλήρωσε την εμπειρία σου!</ion-subtitle>
            </div>
        </div>
    </ion-card>
{/if}

<ion-modal
      is-open={inlineModalOpen && !$autheticationFlag}
      initial-breakpoint={0.5}
      {breakpoints}
      on:ionModalDidDismiss={inlineModalDismissed}>
      <ion-content class="ion-padding">
        <!-- <div class="ion-margin-top">
            <ion-label><b>Τα webmail και e-learning είναι σε αναβάθμιση</b></ion-label>

          </div> -->
          <!-- <ion-item-group>
            <ion-item lines="none">
                <ion-text>
                    <h2>Τα webmail και e-learning είναι σε αναβάθμιση</h2>
                </ion-text>
            </ion-item>
            <ion-item lines="none">
                <ion-text>
                    <p>Ενημερώνουμε την εφαρμογή ώστε να ενσωματώσουμε το σύστημα σύνδεσης του ΑΠΘ. Δυστυχώς αυτό σημαίνει ότι <b>προσωρινά</b> δεν θα είναι διαθέσιμα τα webmail και e-learning.</p>
                    <img src={darkIcon} alt="Dark Icon" class="icon darkIcon" style="width: 50%; height:auto; left:50%"/>
                    <img src={lightIcon} alt="Light Icon" class="icon lightIcon" style="width: 50%; height:auto; left:50%"/>            
                </ion-text>
            </ion-item>
            </ion-item-group> -->
            <CredentialLogin/>
      </ion-content>
   </ion-modal>

<style>

    .mainContents{
        display: flex;
        flex-direction: row;
        /* justify-content: center; */
        align-items: center;
        width: 100%;
    }

    .cardTitle {
        color: #1A81D7;
    }

    .ComingSoonContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 3;
    }

    .darkIcon{
        display: none;
    }

    .icon{
        height: 4rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-left: 1rem;
    }

    :global(body.dark) .lightIcon{
        display: none;
    }
    :global(body.dark) .darkIcon{
        display: block;
    }

    ion-card{
        box-shadow: none;
    }


    ion-card::before{
        content: "";
        position: absolute;
        top: 0; 
        left: 0;
        width: 100%; 
        height: 100%; 
        background-image: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientAnimation 10s linear infinite;
        /* filter:blur(2rem); */
        opacity: 0.08;
    }

    @keyframes gradientAnimation {
            0% {
            background-position: 0% 50%;
            }
            50% {
            background-position: 100% 50%;
            }
            100% {
            background-position: 0% 50%;
            }
        }

</style>