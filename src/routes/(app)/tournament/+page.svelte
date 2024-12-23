<script lang="ts">
	import type { PageData } from './$types';
	import { Filter } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tabs from '$lib/components/ui/tabs';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { cn, formatNaira } from '$lib/utils';

	const gameId = queryParam('gameId', ssp.number());

	const { data } = $props();
	let games = $state([
		{
			name: 'chess',
			id: 1
		},
		{
			name: 'uno',
			id: 2
		},
		{
			name: 'ludo',
			id: 3
		},
		{
			name: 'rps',
			id: 4
		},
		{
			name: 'checkers',
			id: 5
		}
	]);
</script>

<div class="flex items-center justify-between gap-5">
	<h1 class=" text-2xl font-medium">Tournaments</h1>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger><Filter /></DropdownMenu.Trigger>
		<DropdownMenu.Content class="bg-[#2E2E30] text-white ">
			<DropdownMenu.Group>
				<DropdownMenu.Item>Created by me</DropdownMenu.Item>

				<DropdownMenu.Item>Number of players</DropdownMenu.Item>
				<DropdownMenu.Item>By price</DropdownMenu.Item>
				<DropdownMenu.Item>By location</DropdownMenu.Item>
				<DropdownMenu.Item>By type</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
<div
	class="my-6 flex w-full items-center justify-between rounded-3xl bg-[#2E2E30] px-4 py-3 text-sm"
>
	<button
		onclick={() => {
			$gameId = 0;
		}}
		class={cn('h-fit w-fit rounded-2xl  px-2 py-1 text-white', {
			'bg-blue-600': !$gameId
		})}>All</button
	>
	{#each games as game}
		<button
			onclick={() => {
				$gameId = game.id;
			}}
			class={cn('h-fit w-fit rounded-2xl  px-2 py-1 text-white', {
				'bg-blue-600': $gameId === game.id
			})}>{game.name}</button
		>
	{/each}
</div>

<div class="space-y-4">
	{#each data.tournaments as tournament}
		<a href={`/tournament/${tournament.id}`} class="rounded-md border block border-[#AFAFAF] p-4">
			<div class="mb-2 flex justify-between text-sm font-medium">
				<p class="capitalize">{tournament.name}</p>
				<p>{formatNaira(tournament.fee)}</p>
			</div>
			<p class="mb-2 flex items-center gap-5 text-xs text-[#AFAFAF]">
				<img src="/people.svg" alt="" />
				<span class="font-medium">{tournament.maxPlayers}</span>
			</p>
			<p class="mb-2 flex items-center gap-5 text-xs text-[#AFAFAF]">
				<img src="/clock.svg" alt="" />
				<span class="font-medium">{tournament.duration}</span>
			</p>
			<div class="mb-2 flex items-center justify-between text-xs text-[#AFAFAF]">
				<p class="flex items-center gap-5">
					<img src="/unLock.svg" alt="" />
					<span class="font-medium">{tournament.type}</span>
				</p>
				<p>{tournament.currentPlayers} users joined</p>
			</div>
		</a>
	{:else}
		<div class="text-center">
			<p class="mb-1 text-base font-medium">No tournaments available yet!</p>
			<p class="text-xs font-normal">Check back later or create your own tournament.</p>
		</div>
	{/each}
</div>
