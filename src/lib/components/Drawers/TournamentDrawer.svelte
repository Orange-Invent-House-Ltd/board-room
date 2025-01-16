<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import { formatNaira } from '$lib/utils';
	type Props = {
		open: boolean;
		name?: string;
		startTime?: Date;
		type?: string;
		fee?: number;
		maxPlayers?: number;
		numberOfRounds?: number | null;
	};

	let {
		open = $bindable(),
		maxPlayers,
		name,
		startTime,
		type,
		fee,
		numberOfRounds
	}: Props = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Content class=" mx-auto max-w-md border-none bg-[#2E2E30] p-6 text-white">
		<div class="flex justify-end">
			<Drawer.Close class="text-gray-400 hover:text-white">
				<X size={24} />
			</Drawer.Close>
		</div>
		<div class="space-y-6 text-center">
			<img src="/verified.svg" class="mx-auto w-fit" alt="" />
			{#if type === 'public'}
				<p class="font-medium uppercase">PUBLIC TOURNAMENT SUCCESSFUL</p>
				<p class="pb-10 text-center text-sm">
					You have successfully created a public tournament. You will be notified how many players
					are interested.
				</p>
			{:else}
				<p class="font-medium uppercase">PRIVATE TOURNAMENT SUCCESSFUL</p>
				<p class="pb-10 text-center text-sm">
					You have successfully created a Private tournament. You will be notified how many players
					are interested.
				</p>
			{/if}

			<div class="space-y-5">
				<div class="flex items-center justify-between">
					<p>Tournament name</p>

					<p>{name}</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Number of players</p>
					<p>{maxPlayers}</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Starts Time</p>
					<p class="text-sm">
						{startTime
							? new Date(startTime).toLocaleString('en-US', {
									dateStyle: 'full',
									timeStyle: 'short'
								})
							: 'Not set'}
					</p>
				</div>
				{#if numberOfRounds}
					<div class="flex items-center justify-between">
						<p>Number of rounds</p>
						<p>{numberOfRounds}</p>
					</div>
				{/if}
				<div class="flex items-center justify-between">
					<p>Tournament type</p>
					<p>{type}</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Tournament fee</p>
					<p>{formatNaira(fee)}</p>
				</div>
			</div>
			<Button variant="outline" class="mt-6 w-full rounded-full bg-[#3574F5]">Share link</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
