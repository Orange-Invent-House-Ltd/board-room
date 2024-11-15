<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="">
	<h1 class="text-2xl font-medium mb-6">Game Details</h1>
	<img src="/verified.svg" class="mx-auto w-fit" alt="" />
	<h2 class="font-medium uppercase text-center mt-2 mb-6">PUBLIC TOURNAMENT SUCCESSFUL</h2>
	<div class="max-w-[307px] w-full mx-auto space-y-3">
		<div class="flex capitalize items-center justify-between">
			<p class="font-light">game type</p>
			<p>Chess</p>
		</div>
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">tournament name</p>
			<p>Blitz</p>
		</div>
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Number of players</p>
			<p>10</p>
		</div>
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Tournament duration</p>
			<p>10 hours</p>
		</div>
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Tournament type</p>
			<p>Public</p>
		</div>
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Tournament fee</p>
			<p>___</p>
		</div>
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Created by</p>
			<p>Lawal adebola</p>
		</div>
		<div class="grid grid-cols-2 pt-10 items-center gap-3">
			<Button variant="ghost">Reject invite</Button>
			<Button>Accept invite</Button>
		</div>
	</div>
</div>
