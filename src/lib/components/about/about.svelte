<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  const teamMembers = writable([]);
  
  async function fetchTeamMembers() {
    try {
      const response = await fetch('/src/lib/components/about/contributors.json'); 
      const data = await response.json();

      const members = data.contributors;

      teamMembers.set(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }

  onMount(fetchTeamMembers);

</script>

<ion-content class="ion-padding">
<div>
<!-- About Us Card -->
<div class="about-card">
  <div class="card-content">

    <!-- Introduction -->
    <div class="section">
      <h2 class="section-title">Ποιοι είμαστε</h2>
      <p style="font-size: 14px;">Γεια χαρά! Χαιρόμαστε πολύ που χρησιμοποιείς το Aristomate, την εφαρμογή που φτιάχτηκε από φοιτητές για φοιτητές! <br> <br>
        Οκτώ φοιτητές από την ομάδα της <a href="https://auth.acm.org/">ACM AUTh</a> διαπιστώσαμε ότι στο χάος της καθημερινότητας ενός φοιτητή, ένας “ψηφιακός φίλος” που συγκεντρώνει την ακαδημαϊκή του εμπειρία σε ένα και μοναδικό σημείο είναι χρήσιμος για την επιβίωσή του. 
        </p>
    </div>          

    <!-- Meet the Team -->
    <div class="section">
      <h2 class="section-title">Γνώρισε την ομάδα μας</h2>
        {#each $teamMembers as member}
          <ion-card href={member.personal_link}>
            <ion-card-content class="team-card-content">
              <div class="member-info">
                <ion-avatar slot="start">
                  <img src={member.image_url} alt={member.name}>
                </ion-avatar>
                <h3 class="member-name">{member.name}</h3>
              </div>
            </ion-card-content>
          </ion-card>
        {/each}
    </div>

    <!-- Mission Statement -->
    <div class="section">
      <h2 class="section-title">Η αποστολή μας</h2>
      <p style="font-size: 14px;">Στόχος μας είναι να διευκολύνουμε τους φοιτητές του πανεπιστημίου τόσο στη γρηγορότερη ενημέρωσή τους πάνω στα μαθήματα και την πρόοδό τους, όσο και στην ευκολότερη φοιτητική “επιβίωση”.</p>
    </div>

    <!-- Contact Information -->
    <div class="section">
      <h2 class="section-title">Βρες μας</h2>
      <div class="social-icons">
        <a href="https://www.facebook.com/acmauth" target="_blank">
          <img src="src/lib/assets/facebook.svg" alt="Facebook" class="social-icon facebook">
        </a>
        <a href="https://www.instagram.com/acmauth/" target="_blank">
          <img src="src/lib/assets/instagram.svg" alt="Instagram" class="social-icon instagram">
        </a>
        <a href="https://github.com/acmauth/StudentCompanion" target="_blank">
          <img src="src/lib/assets/github.svg" alt="GitHub" class="social-icon github">
        </a>
        <a href="https://www.linkedin.com/company/acm-auth-student-chapter/" target="_blank">
          <img src="src/lib/assets/linkedin.svg" alt="LinkedIn" class="social-icon linkedin">
        </a>
        <a href="https://discord.gg/dUYrkbEj7q" target="_blank">
          <img src="src/lib/assets/discord.svg" alt="Discord" class="social-icon discord">
        </a>
      </div>
    </div>
  </div>
</div>
</div>
</ion-content>

<style>
  
.card-content {
  padding: 20px;
}

.section {
  margin-bottom: 30px;
  align-items: flex-start;
}

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

</style>
  