<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { formatNaira } from '$lib/utils';

	import { Trophy } from 'lucide-svelte';
</script>

<div>
	<h1 class="mb-4 text-center text-2xl font-bold capitalize">lawal</h1>
	<div class=" mx-auto h-full min-h-[110px] w-full max-w-[354px] rounded-xl bg-blue-500 py-5">
		<div class="mx-auto w-fit text-center">
			<Trophy class="mx-auto" />
			<Badge class="my-2">Badge</Badge>
			<h1 class="text-2xl font-bold">{formatNaira(100)}</h1>
		</div>
	</div>
</div>

{#each { length: 5 } as _}
	<div
		class="flex items-center justify-between mt-5 border border-gray-500 rounded-lg p-3 text-white"
	>
		<div class="flex items-center space-x-2">
			<img src="/avatar.png" alt="Avatar" class="size-9 rounded-full" />
			<div>
				<p class=" font-semibold">@Grand_Maestro</p>
				<p class="text-sm text-gray-400">Expert</p>
			</div>
		</div>
		<div class="text-red-500 font-bold text-xl">VS</div>
		<div class="flex items-center space-x-2">
			<img src="/avatar.png" alt="Avatar" class="size-9 rounded-full" />
			<div>
				<p class=" font-semibold">@Chess.kng</p>
				<p class="text-sm text-gray-400">Expert</p>
			</div>
		</div>
	</div>
{/each}
