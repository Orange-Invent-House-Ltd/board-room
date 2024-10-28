<script lang="ts">
	import { page } from '$app/stores';
	import Cat from '../components/Cat.svelte';
	import Pwc from '../components/Pwc.svelte';
	import Test from '../components/Test.svelte';
	let { data } = $props();
</script>

{#if $page.params.typeOfPlay === 'play-with-computer'}
	<Pwc />
{:else if $page.params.typeOfPlay === 'create-tournament'}
	<Cat catForm={data.catForm} />
{:else if $page.params.typeOfPlay === 'test'}
	<Test />
{/if}
