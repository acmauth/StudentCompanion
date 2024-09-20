<script>
	import About from '$components/about/about.svelte';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import { t, locale, locales} from "$lib/i18n";
</script>

<SubPageHeader title={$t("about.title")} />
<About />
