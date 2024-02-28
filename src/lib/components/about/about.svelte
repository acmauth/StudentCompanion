<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  let personal_links = [
    "https://github.com/TolisSth",
    "https://www.linkedin.com/in/christos-balaktsis/",
    "https://github.com/dangelidou",
    "https://github.com/Kostaga",
    "https://github.com/VirtualVirtuosoV1",
    "https://gr.linkedin.com/in/myrto-gkogkou-67b004260",
    "https://www.linkedin.com/in/neronmkp/",
    "https://github.com/VasilisMicha"
  ];

  // Define a writable store for team members
  const teamMembers = writable([]);
  
  // Function to fetch team members from the GitHub Markdown file
  async function fetchTeamMembers() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/acmauth/StudentCompanion/dev/README.md');
      const markdownText = await response.text();

      // Regular expression to match the table containing team members
      const regex = /<table>(.*?)<\/table>/gs;
      const tableMatch = regex.exec(markdownText);
      if (!tableMatch) {
        throw new Error('Table not found in the Markdown file');
      }

      // Regular expression to extract image URLs and names from table rows
      const memberRegex = /<img src="(.*?)" .*?alt="(.*?)"\/>/g;
      let members = [];
      let match;
      while ((match = memberRegex.exec(tableMatch[1])) !== null) {
        members.push({ imageUrl: match[1], name: match[2] });
      }

      // Update the teamMembers store with the fetched data
      teamMembers.set(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }

  // Fetch team members on component mount
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
        <!-- Use reactive statement to update UI when teamMembers changes -->
        {#each $teamMembers as member, index}
          <ion-card href={personal_links[index]}>
            <ion-card-content class="team-card-content">
              <div class="member-info">
                <ion-avatar slot="start">
                  <img src={member.imageUrl} alt={member.name}>
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
/* Custom styles */
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
  margin-left: 10px; /* Adjust as needed */
}

.social-icons {
display: flex;
justify-content: center;
align-items: center;
margin-top: 10px;
}

.social-icon {
  width: 40px; /* Adjust the size of the icons */
  height: 40px;
  margin: 0 15px;
  transition: transform 0.3s ease; /* Smooth transition on hover */
}

.social-icon:hover {
  transform: scale(1.2); /* Increase size on hover */
}


</style>
  