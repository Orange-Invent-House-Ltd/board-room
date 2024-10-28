<script lang="ts">
	import { page } from '$app/stores';
	import Cat from '../components/Cat.svelte';
	import Ip from '../components/Ip.svelte';
	import Pwc from '../components/Pwc.svelte';
	import Pwf from '../components/Pwf.svelte';
	import Sag from '../components/Sag.svelte';
	let { data } = $props();
</script>

{#if $page.params.typeOfPlay === 'play-with-computer'}
	<Pwc pwcForm={data.pwcForm} />
{:else if $page.params.typeOfPlay === 'play-with-friend'}
	<Pwf pwfForm={data.pwfForm} />
{:else if $page.params.typeOfPlay === 'schedule-game'}
	<Sag sagForm={data.sagForm} />
{:else if $page.params.typeOfPlay === 'create-tournament'}
	<Cat catForm={data.catForm} />
{:else if $page.params.typeOfPlay === 'instant-play'}
	<Ip ipForm={data.ipForm} />
{:else}
	<p>page not found</p>
{/if}
