<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  interface TeamMember {
      id: string;
      imageUrl: string;
      name: string;
      bio: string; // Add other properties as needed
  }
  
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
    <!-- About Us Title -->
    <h1 class="about-us-title">
      <span class="about-us-text">About Us</span>
    </h1>

    <!-- Introduction -->
    <div class="section">
      <h2 class="section-title">Introduction</h2>
      <p>Welcome to [Your App Name], your ultimate companion for [brief description of your app's purpose]. Our mission is to [describe the main goal or purpose of your app].</p>
    </div>          

    <!-- Meet the Team -->
    <div class="section">
      <h2 class="section-title">Meet the Team</h2>
      <div class="team-list">
        <!-- Use reactive statement to update UI when teamMembers changes -->
        {#each $teamMembers as member}
          <ion-card>
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
    </div>

    <!-- Mission Statement -->
    <div class="section">
      <h2 class="section-title">Mission Statement</h2>
      <p>Our mission at [Your App Name] is to [state your mission statement here]. We strive to [describe the impact you aim to make with your app]. Together, let's [inspiring message].</p>
    </div>

    <!-- Contact Information -->
    <div class="section">
      <h2 class="section-title">Find Us</h2>
      <div class="social-icons">
        <a href="https://www.facebook.com/example" target="_blank">
          <img src="src/lib/assets/facebook.svg" alt="Facebook" class="social-icon facebook">
        </a>
        <a href="https://www.instagram.com/example" target="_blank">
          <img src="src/lib/assets/instagram.svg" alt="Instagram" class="social-icon instagram">
        </a>
        <a href="https://github.com/example" target="_blank">
          <img src="src/lib/assets/github.svg" alt="GitHub" class="social-icon github">
        </a>
        <a href="https://www.linkedin.com/company/example" target="_blank">
          <img src="src/lib/assets/linkedin.svg" alt="LinkedIn" class="social-icon linkedin">
        </a>
      </div>
    </div>
  </div>
</div>
</div>
</ion-content>

<style>
/* Custom styles */
.about-card {
  margin-bottom: 30px;
  border-radius: 15px;
  box-shadow: var(--ion-shadow-md);
}


.card-content {
  padding: 20px;
}

.about-us-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem; /* Larger font size */
}

.about-us-text {
  background: linear-gradient(to right, var(--ion-color-primary), var(--ion-color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  color: var(--ion-color-primary);
  margin-bottom: 15px;
}
  

.avatar-circle ion-img {
  border-radius: 50%;
}

.member-info {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 50px; /* Adjust the width of the avatar */
  height: 50px; /* Adjust the height of the avatar */
}

.member-name {
  margin-left: 10px; /* Adjust as needed */
}
  
.scroll-content {
  overflow-y: auto; 
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
  