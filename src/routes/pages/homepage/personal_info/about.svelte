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
  import { construct, heartOutline, peopleOutline, rocketOutline, locationOutline } from 'ionicons/icons';

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
  <div class="about-intro about-section">
    <ion-icon icon={peopleOutline} color="primary" class="intro-icon" aria-hidden="true"></ion-icon>
    <!-- <h1 class="intro-title">{$t("about.subtitle")}</h1> -->
    <p class="intro-subtitle">{$t("about.subtitle")}</p>
  </div>

  <div class="about-section">
    <h2 class="section-title">
      <ion-icon icon={heartOutline} aria-hidden="true"></ion-icon>
      {$t("about.who_are_we")}
    </h2>
    <p class="section-text">{$t("about.who_are_we_text_1")}</p>
    <p class="section-text">{@html $t("about.who_are_we_text_2")}</p>
  </div>

  <div class="about-section">
    <h2 class="section-title">
      <ion-icon icon={peopleOutline} aria-hidden="true"></ion-icon>
      {$t("about.meet_team")}
    </h2>
    <div class="team-list">
      {#each $teamMembers as member (member.name)}
        <ion-card href={member.personal_link} class="team-card">
          <ion-card-content class="team-card-content">
            <div class="member-info">
              <ion-avatar slot="start">
                <img src={member.image_url} alt={member.name}>
              </ion-avatar>
              <h3 class="member-name">
                {member.name}
                {#if member.maintainer}
                  <ion-icon icon={construct} color="primary" class="maintainer-icon" title="Maintainer"></ion-icon>
                {/if}
              </h3>
            </div>
          </ion-card-content>
        </ion-card>
      {/each}
    </div>
  </div>

  <div class="about-section">
    <h2 class="section-title">
      <ion-icon icon={rocketOutline} aria-hidden="true"></ion-icon>
      {$t("about.mission")}
    </h2>
    <p class="section-text">{$t("about.mission_text")}</p>
  </div>

  <div class="contact-card about-section">
    <!-- <ion-icon icon={locationOutline} color="primary" class="contact-icon" aria-hidden="true"></ion-icon> -->
    <h2 class="contact-title">{$t("about.find_us")}</h2>
    <div class="social-icons">
      <a href="https://www.facebook.com/acmauth" target="_blank">
        <img src={facebook} alt="Facebook" class="social-icon">
      </a>
      <a href="https://www.instagram.com/acmauth/" target="_blank">
        <img src={instagram} alt="Instagram" class="social-icon">
      </a>
      <a href="https://github.com/acmauth/StudentCompanion" target="_blank">
        <img src={github} alt="GitHub" class="social-icon">
      </a>
      <a href="https://www.linkedin.com/company/acm-auth-student-chapter/" target="_blank">
        <img src={linkedin} alt="LinkedIn" class="social-icon">
      </a>
      <a href="https://discord.gg/dUYrkbEj7q" target="_blank">
        <img src={discord} alt="Discord" class="social-icon">
      </a>
    </div>
  </div>
</ion-content>
</IonPage>

<style>
  ion-content {
    --padding-end: 1.5rem;
    --padding-start: 1.5rem;
  }

  .about-section {
    margin-bottom: 1.75rem;
  }

  .about-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .intro-icon {
    font-size: 42px;
    margin-bottom: 0.5rem;
  }

  .intro-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .intro-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: var(--ion-color-medium);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ion-color-primary);
  }

  .section-text {
    margin: 0 0 0.75rem;
    font-size: 14px;
    line-height: 1.5;
  }

  .section-text:last-child {
    margin-bottom: 0;
  }

  .section-text :global(a) {
    color: var(--ion-color-primary);
  }

  .team-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  ion-card.team-card {
    margin: 0;
  }

  .team-card-content {
    padding: 0.75rem 1rem;
  }

  .member-info {
    display: flex;
    align-items: center;
  }

  .member-name {
    display: flex;
    align-items: center;
    margin: 0 0 0 0.75rem;
    font-size: 1rem;
  }

  .maintainer-icon {
    margin-left: 0.4rem;
    font-size: 1rem;
  }

  .contact-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: var(--ion-color-light);
    border-radius: 16px;
    padding: 1.75rem 1.25rem;
  }

  .contact-icon {
    font-size: 34px;
    margin-bottom: 0.5rem;
  }

  .contact-title {
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .social-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.25rem;
  }

  .social-icon {
    width: 40px;
    height: 40px;
    transition: transform 0.2s ease;
  }

  .social-icon:hover {
    transform: scale(1.15);
  }
</style>
