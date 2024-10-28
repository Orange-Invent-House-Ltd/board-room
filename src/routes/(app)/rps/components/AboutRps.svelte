<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let {
		onclick
	}: {
		onclick: () => void;
	} = $props();
</script>

<h1 class="mb-10 text-2xl font-medium">Rock, Paper, Scissors</h1>
<main class="relative space-y-6">
	<div>
		<h2 class=" font-medium capitalize">About RPS</h2>
		<p class="text-xs">
			A classic game - Rock, Paper, Scissors! Choose one of the three choices - and see if you can
			beat the computer or your opponents. Will you win? The chance is random!
		</p>
	</div>

	<div class="fixed bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button {onclick} class="w-full rounded-full bg-blue-600 py-3 text-white">Play Rps</Button>
	</div>
</main>
