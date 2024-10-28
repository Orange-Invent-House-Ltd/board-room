<script lang="ts">
	import type { Card } from './types';
	import CardImage from './CardImage.svelte';

	export let cards: Card[];
</script>

<div class="computer-hand">
	{#each cards as card}
		<CardImage card={{} as Card} faceDown={true} />
	{/each}
</div>

<style>
	.computer-hand {
		display: flex;
		gap: 10px;
	}
</style>
