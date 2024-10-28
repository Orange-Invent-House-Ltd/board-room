<script lang="ts">
	import { page } from '$app/stores';
	import Dc from '../components/Dc.svelte';
	import Pwc from '../components/Pwc.svelte';
</script>

{#if $page.params.typeOfPlay === 'play-with-computer'}
	<Pwc />
{:else if $page.params.typeOfPlay === 'daily-challenge'}
	<Dc />
{:else}
	<p>page not found</p>
{/if}
