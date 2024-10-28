<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<Drawer.Root>
	<Drawer.Trigger>
		<Avatar.Root>
			<Avatar.Image src={$page.data.userWithStats.picture} alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	</Drawer.Trigger>
	<Drawer.Content class=" mx-auto max-w-md border-none bg-[#2E2E30] p-6 text-white">
		<div class="flex justify-end">
			<Drawer.Close class="text-gray-400 hover:text-white">
				<X size={24} />
			</Drawer.Close>
		</div>
		<div class="mb-6 flex flex-col items-center">
			<Avatar.Root class="mb-2 h-16 w-16">
				<Avatar.Image src={$page.data.userWithStats.picture} alt={$page.data.userWithStats.name} />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<h2 class="text-xl font-semibold">{$page.data.userWithStats.name}</h2>
		</div>

		<div class="space-y-4">
			{#each $page.data.userWithStats.stats as stat}
				<div>
					<h3 class="mb-2 text-lg font-medium capitalize">{stat.game.name}</h3>
					<div class="grid grid-cols-4 gap-2 rounded-lg border border-[#6D6D6E] p-3 text-center">
						<div>
							<p class="font-bold">{stat.globalRanking}</p>
							<p class="text-xs text-gray-400">Global Ranking</p>
						</div>
						<div>
							<p class="font-bold">{stat.gamesPlayed}</p>
							<p class="text-xs text-gray-400">Games Played</p>
						</div>
						<div>
							<p class="font-bold">{stat.gamesWon}</p>
							<p class="text-xs text-gray-400">Games Won</p>
						</div>
						<div>
							<p class="font-bold">{stat.gamesLost}</p>
							<p class="text-xs text-gray-400">Games Lost</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<Button variant="outline" class="mt-6 w-full rounded-full bg-[#2E2E30]">Share stats</Button>

		<p class="mt-4 text-center text-xs font-light">
			To edit your username, go to "My profile" by clicking on "More".
		</p>
	</Drawer.Content>
</Drawer.Root>
