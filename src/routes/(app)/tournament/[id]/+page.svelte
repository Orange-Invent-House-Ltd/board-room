<script lang="ts">
	import { Trophy } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import { formatNaira } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';

	let tournamentInfo = {
		gameMode: '15 + 10 Rapid',
		gameDuration: '10 hours',
		gameType: 'Private',
		gameMembers: '25 players',
		timeLeft: '09:00:14'
	};
	let timeLeft = tournamentInfo.timeLeft;
	let { data } = $props();
	console.log('🚀 ~ data:', data.participant);
</script>

<div>
	<h1 class="mb-4 text-center text-2xl font-bold capitalize">{data.tournament.name}</h1>
	<div class=" mx-auto h-full min-h-[110px] w-full max-w-[354px] rounded-xl bg-blue-500 py-5">
		<div class="mx-auto w-fit text-center">
			<Trophy class="mx-auto" />
			<Badge class="my-2">Badge</Badge>
			<h1 class="text-2xl font-bold">{formatNaira(data.tournament.fee)}</h1>
		</div>
	</div>
	<div class="rounded-lg bg-black py-6 font-sans text-white">
		<h2 class="mb-6 font-medium">Tournament Info</h2>

		<div class="space-y-4">
			{#each Object.entries(data.tournament) as [key, value]}
				<div class="flex items-center justify-between">
					<span class="text-sm"
						>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span
					>
					<span class="text-sm font-semibold">
						{key === 'timeLeft' ? timeLeft : value}
					</span>
				</div>
			{/each}
		</div>
	</div>

	<h2 class="mb-4 mt-10 text-base font-medium">Current Leaderboard</h2>
	{#each data.tournament.participants as participant}
		<Table.Root>
			<Table.Header>
				<Table.Row class="text-[#C6C6C6]">
					<Table.Head class="w-[100px] text-[#C6C6C6]">Player</Table.Head>
					<Table.Head class="text-[#C6C6C6]">Rating</Table.Head>
					<Table.Head class="text-[#C6C6C6]">Win</Table.Head>
					<Table.Head class="text-[#C6C6C6]">Draw</Table.Head>
					<Table.Head class="text-[#C6C6C6]">Lost</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="flex w-full  items-center gap-1 truncate font-medium">
						<img src={participant.user.picture} class="size-10" alt="" />
						<p class="text-xs font-medium">{participant.user.username}</p>
					</Table.Cell>
					<Table.Cell class="text-sm font-medium text-white">{participant.points}</Table.Cell>
					<Table.Cell class="text-sm font-medium text-green-500">{participant.wins}</Table.Cell>
					<Table.Cell class="text-sm font-medium text-white">{participant.draws}</Table.Cell>
					<Table.Cell class="text-sm font-medium text-red-500">{participant.losses}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	{:else}
		<div
			class="w-full text-center capitalize h-20 flex items-center justify-center text-muted-foreground"
		>
			no participants yet
		</div>
	{/each}
	{#if !data.participant}
		<form
			use:enhance
			method="POST"
			action={`?/abortGame`}
			class="sticky bottom-0 flex gap-5 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5"
		>
			<Button type="submit" class="w-full rounded-full bg-blue-600 py-3 text-white"
				>Join tournament</Button
			>
			<Button variant="outline" class="w-full rounded-full  py-3 text-white"
				>Watch tournament</Button
			>
		</form>
	{/if}
</div>
