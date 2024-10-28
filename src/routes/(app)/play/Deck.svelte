<script lang="ts">
	import type { Card } from './types';
	import { createEventDispatcher } from 'svelte';
	import CardImage from './CardImage.svelte';

	export let deck: Card[];
	const dispatch = createEventDispatcher();

	function drawCard() {
		dispatch('drawCard');
	}
</script>

<div class="deck" on:click={drawCard}>
	<CardImage card={{} as Card} faceDown={true} />
	<span class="card-count">{deck.length}</span>
</div>

<style>
	.deck {
		position: relative;
		cursor: pointer;
	}
	.card-count {
		position: absolute;
		bottom: 5px;
		right: 5px;
		background-color: rgba(255, 255, 255, 0.7);
		padding: 2px 5px;
		border-radius: 10px;
		font-size: 12px;
	}
</style>
