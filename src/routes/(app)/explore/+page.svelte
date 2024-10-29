<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { Button } from '$lib/components/ui/button';
	const games = [
		{
			href: '/chess',
			imgHead: '/chessCard/chessHeader.svg',
			imgBoard: '/chessCard/chessboard.svg'
		},
		{
			href: '/uno',
			imgHead: '/unoCard/unoHead.png',
			imgBoard: '/unoCard/unoBoard.png'
		},
		{
			href: '/ludo',
			imgHead: '/ludoCard/ludoHead.png',
			imgBoard: '/ludoCard/ludoBoard.png'
		},
		{
			href: '/checkers',
			imgHead: '/checkerCard/checkerHead.png',
			imgBoard: '/checkerCard/checkerBoard.png'
		},
		{
			href: '/rps',
			imgHead: '/rpsCard/rpsHead.png',
			imgBoard: '/rpsCard/rpsBoard.png'
		}
	];

	// Preload images
	$: preloadedImages = games.flatMap(({ imgHead, imgBoard }) => [imgHead, imgBoard]);
</script>

<svelte:head>
	{#each preloadedImages as image}
		<link rel="preload" href={image} as="image" />
	{/each}
</svelte:head>

<div>
	<h1 class="mb-20 text-2xl font-medium">Explore</h1>
</div>

<Carousel.Root class="mb-10 w-full">
	<Carousel.Content class="-ml-6 ">
		{#each games as { href, imgBoard, imgHead }, i (i)}
			<Carousel.Item class=" basis-2/3 pl-6 md:basis-1/2 lg:basis-1/2">
				<div class="relative h-full object-contain">
					<img src={imgHead} alt="" />
					<img src={imgBoard} class="rounded-b-md" alt="" />
					<Button
						{href}
						class="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black font-bold uppercase "
						>Tap To Play</Button
					>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
</Carousel.Root>
