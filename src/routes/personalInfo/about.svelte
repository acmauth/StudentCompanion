<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import discord from "$lib/assets/discord.svg";
  import instagram from "$lib/assets/instagram.svg";
  import github from "$lib/assets/github.svg";
  import linkedin from "$lib/assets/linkedin.svg";
  import facebook from "$lib/assets/facebook.svg";
  import contributors from "$lib/components/personalInfo/contributors.json";
  import { t, locale, locales} from "$lib/i18n";
  import SubPageHeader from '$shared/subPageHeader.svelte';
  import IonPage from 'ionic-svelte/components/IonPage.svelte';
  import { construct } from 'ionicons/icons';

  interface Contributor {
    name: string;
    personal_link: string;
    image_url: string;
    maintainer: boolean;
  }

  const teamMembers = writable<Contributor[]>([]);
  
  async function fetchTeamMembers() {
    try {
      const members = contributors.contributors;
      
      // Separate maintainers and regular members
      const maintainers = members.filter(m => m.maintainer);
      const regular = members.filter(m => !m.maintainer);
      
      // Suffle maintainers
      for (let i = maintainers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [maintainers[i], maintainers[j]] = [maintainers[j], maintainers[i]];
      }
      
      // Shuffle regular members
      for (let i = regular.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [regular[i], regular[j]] = [regular[j], regular[i]];
      }
      
      // Combine: maintainers first, then shuffled regular members
      teamMembers.set([...maintainers, ...regular]);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }

  onMount(fetchTeamMembers);

</script>

<IonPage>
<SubPageHeader title={$t("about.title")} stackedNav/>
<ion-content class="ion-padding">
<div>
<!-- About Us Card -->
<div class="about-card">
  <div class="card-content">

    <!-- Introduction -->
    <div class="section">
      <h2 class="section-title">{$t("about.who_are_we")}</h2>
      <p style="font-size: 14px;">{$t("about.who_are_we_text_1")} <br> <br>
        {@html $t("about.who_are_we_text_2")} 
      </p>
    </div>          

    <!-- Meet the Team -->
    <div class="section">
      <h2 class="section-title">{$t("about.meet_team")}</h2>
      
        {#each $teamMembers as member}
          <ion-card href={member.personal_link}>
            <ion-card-content class="team-card-content">
              <div class="member-info">
                <ion-avatar slot="start">
                  <img src={member.image_url} alt={member.name}>
                </ion-avatar>
                <h3 class="member-name">
                  {member.name}
                  {#if member.maintainer}
                    <ion-icon icon={construct} color="primary" style="margin-left: 5px; vertical-align: middle;" title="Maintainer"></ion-icon>
                  {/if}
                </h3>
              </div>
            </ion-card-content>
          </ion-card>
        {/each}
    </div>

    <!-- Mission Statement -->
    <div class="section">
      <h2 class="section-title">{$t("about.mission")}</h2>
      <p style="font-size: 14px;">{$t("about.mission_text")}</p>
    </div>

    <!-- Contact Information -->
    <div class="section">
      <h2 class="section-title">{$t("about.find_us")}</h2>
      <div class="social-icons">
        <a href="https://www.facebook.com/acmauth" target="_blank">
          <img src={facebook} alt="Facebook" class="social-icon facebook">
        </a>
        <a href="https://www.instagram.com/acmauth/" target="_blank">
          <img src={instagram} alt="Instagram" class="social-icon instagram">
        </a>
        <a href="https://github.com/acmauth/StudentCompanion" target="_blank">
          <img src={github} alt="GitHub" class="social-icon github">
        </a>
        <a href="https://www.linkedin.com/company/acm-auth-student-chapter/" target="_blank">
          <img src={linkedin} alt="LinkedIn" class="social-icon linkedin">
        </a>
        <a href="https://discord.gg/dUYrkbEj7q" target="_blank">
          <img src={discord} alt="Discord" class="social-icon discord">
        </a>
      </div>
    </div>
  </div>
</div>
</div>
</ion-content>
</IonPage>

<style>
  
.card-content {
  padding: 20px;
}

/* .section {
  margin-bottom: 30px;
  align-items: flex-start;
} */

.section-title {
  color: var(--ion-color-primary);
}

.member-info {
  display: flex;
  align-items: center;
}

.member-name {
  margin-left: 10px; 
}

.social-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.social-icon {
  width: 40px;
  height: 40px;
  margin: 0 15px;
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.2);
}

ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
}

</style>
