<script lang="ts">
  	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { calendar, home, notifications, personCircle, statsChart } from 'ionicons/icons';

  // Routes
	let bottomNav = [
		{
			label: '',
			icon: home,
			tab: 'homepage'
		},
		{
			label: '',
			icon: calendar,
			tab: 'schedule'
		},
		{
			label: '',
			icon: statsChart,
			tab: 'grades'
		},
		{
			label: '',
			icon: notifications,
			tab: 'notifications'
		},
		{
			label: '',
			icon: personCircle,
			tab: 'personalInfo'
		}
	];

	const logsStuff =()=>{};

</script>

<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
	<slot />
</IonTabs>
