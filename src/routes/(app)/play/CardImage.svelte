<!-- <script lang="ts">
	import type { Card } from './types';

	export let card: Card;
	export let faceDown: boolean = false;

	let cardWidth = 240;
	let cardHeight = 360;

	$: src = faceDown ? '/uno.svg' : '/deck.svg';
	$: clipPath = faceDown
		? 'none'
		: `inset(${Math.floor(card.row * cardHeight)}px ${Math.floor((13 - card.column) * cardWidth)}px ${Math.floor((7 - card.row) * cardHeight)}px ${Math.floor(card.column * cardWidth)}px)`;
</script>

<div class="card" style="clip-path: {clipPath};">
	<img
		{src}
		alt="UNO card"
		style="object-fit: none; object-position: -{card.column * cardWidth}px -{card.row *
			cardHeight}px;"
	/>
</div>

<style>
	.card {
		width: 120px;
		height: 180px;
		overflow: hidden;
	}
	img {
		width: 3360px; /* 14 * 240 */
		height: 2880px; /* 8 * 360 */
	}
</style> -->

<script lang="ts">
	import type { Card } from './types';
	export let card: Card;
	export let faceDown: boolean = false;
	export let gridWidth: number = 14;
	export let gridHeight: number = 8;

	let cardWidth = 240;
	let cardHeight = 360;

	$: src = faceDown ? '/uno.svg' : '/deck.svg';
	$: clipPath = faceDown
		? 'none'
		: `inset(${card.row * cardHeight}px ${(gridWidth - 1 - card.column) * cardWidth}px ${(gridHeight - 1 - card.row) * cardHeight}px ${card.column * cardWidth}px)`;

	$: altText = faceDown ? 'Face-down UNO card' : `UNO card: ${'card.name'}`;

	$: imageStyle = faceDown
		? `background-image: url(${src}); background-size: cover;`
		: `object-fit: none; object-position: -${card.column * cardWidth}px -${card.row * cardHeight}px;`;

	$: if (card.row < 0 || card.row >= gridHeight || card.column < 0 || card.column >= gridWidth) {
		console.error('Invalid card position:', card);
	}
</script>

<div class="card" style="clip-path: {clipPath};">
	{#if faceDown}
		<div class="card-face" style={imageStyle} role="img" aria-label={altText}></div>
	{:else}
		<img {src} alt={altText} style={imageStyle} />
	{/if}
</div>

<style>
	.card {
		width: 240px;
		height: 360px;
		overflow: hidden;
	}
	.card-face,
	img {
		width: 100%;
		height: 100%;
	}
	img {
		width: 3360px; /* 14 * 240 */
		height: 2880px; /* 8 * 360 */
	}
</style>
