<script lang="ts">
	import { page } from '$app/stores';
	import Cat from '../components/Cat.svelte';
	import Pwc from '../components/Pwc.svelte';
	import Pwf from '../components/Pwf.svelte';
	let { data } = $props();
</script>

{#if $page.params.typeOfPlay === 'play-with-computer'}
	<Pwc />
{:else if $page.params.typeOfPlay === 'create-tournament'}
	<Cat catForm={data.catForm} />
{:else if $page.params.typeOfPlay === 'play-with-friend'}
	<Pwf pwfForm={data.pwfForm} />
{:else}
	<p>page not found</p>
{/if}
