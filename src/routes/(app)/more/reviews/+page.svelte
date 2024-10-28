<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Star } from 'lucide-svelte';
</script>

<h1 class="mb-10 text-2xl font-medium capitalize">Write a review</h1>
<div class="grid h-[134px] place-items-center border-y">
	<div class="flex items-center gap-5">
		<h2 class="text-xl font-semibold">5.0</h2>
		<div class="space-y-1">
			<div class="flex items-center gap-1">
				{#each { length: 5 } as _}
					<Star />
				{/each}
				<p class="text-lg font-semibold">(1M+)</p>
			</div>
			<p>average rating</p>
		</div>
	</div>
</div>
<div class="space-y-5">
	{#each { length: 5 } as _}
		<div class="mt-5 space-x-2">
			<div class="flex items-center gap-1">
				{#each { length: 5 } as _}
					<Star />
				{/each}
			</div>
			<p class="text-lg">Toni Franey</p>
			<p class="text-sm">
				Lorem ipsum dolor sit amet consectetur. Congue arcu dictum odio ut. Sit sed at venenatis
				natoque donec. Auctor cursus senectus morbi consectetur interdum mauris.
			</p>
		</div>
	{/each}
</div>
