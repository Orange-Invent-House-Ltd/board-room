<script lang="ts">
	import type { Card } from './types';
	import CardImage from './CardImage.svelte';

	export let cards: Card[];
</script>

<div class="discard-pile">
	{#if cards.length > 0}
		<CardImage card={cards[0]} />
	{/if}
</div>

<style>
	.discard-pile {
		width: 120px;
		height: 180px;
	}
</style>
