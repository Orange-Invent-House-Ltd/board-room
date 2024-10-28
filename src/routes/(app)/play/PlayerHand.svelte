<script lang="ts">
	import type { Card } from './types';
	import { createEventDispatcher } from 'svelte';
	import CardImage from './CardImage.svelte';

	export let cards: Card[];
	console.log('🚀 ~ cards:', cards);
	const dispatch = createEventDispatcher();

	function playCard(card: Card) {
		dispatch('playCard', card);
	}
</script>

<div class="player-hand">
	{#each cards as card}
		<button class="card-container" on:click={() => playCard(card)}>
			<CardImage {card} />
		</button>
	{/each}
</div>

<style>
	.player-hand {
		display: flex;
		gap: 10px;
	}
	.card-container {
		cursor: pointer;
		transition: transform 0.2s;
	}
	.card-container:hover {
		transform: translateY(-10px);
	}
</style>
