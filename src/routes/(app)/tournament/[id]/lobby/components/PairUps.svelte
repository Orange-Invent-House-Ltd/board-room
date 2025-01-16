<script lang="ts">
	type Props = {
		pairUps: any;
	};
	let { pairUps }: Props = $props();
</script>

{#if pairUps}
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
{:else}
	<div class="flex items-center h-40 justify-center">
		<p class="text-white">No pairups yet</p>
	</div>
{/if}
