<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { slide } from 'svelte/transition';

	let index = $state(1);
</script>

<svelte:head>
	<link rel="preload" as="image" href={`/howToPlay-1.svg`} />
	<link rel="preload" as="image" href={`/howToPlay-2.svg`} />
	<link rel="preload" as="image" href={`/howToPlay-3.svg`} />
	<link rel="preload" as="image" href={`/howToPlay-4.svg`} />
	<link rel="preload" as="image" href={`/howToPlay-5.svg`} />
	<link rel="preload" as="image" href={`/howToPlay-6.svg`} />
</svelte:head>
<div class="relative">
	<h1 class="mb-10 text-2xl font-medium">How To Play</h1>

	{#key index}
		<div in:slide={{ duration: 500, axis: 'y' }} out:slide={{ duration: 500 }}>
			<img src={`/howToPlay-${index}.svg`} class="w-full" alt="" />
		</div>
	{/key}

	<div
		class="fixed bottom-0 mx-auto mt-8 flex w-full max-w-md items-center gap-5 border-t border-gray-700 bg-black px-5 py-5"
	>
		{#if index === 6}
			<Button class="w-full rounded-full bg-blue-600 py-3 text-white">Start Uno</Button>
		{:else}
			<Button class="w-full rounded-full bg-blue-600 py-3 text-white">Skip tutorial</Button>
			<Button
				onclick={() => {
					if (index === 6) return;
					index++;
				}}
				class="w-full rounded-full bg-background  py-3 text-white hover:bg-background">Next</Button
			>
		{/if}
	</div>
</div>
