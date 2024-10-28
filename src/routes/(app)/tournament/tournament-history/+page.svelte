<script lang="ts">
	import { Trophy } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';

	let tournamentInfo = {
		gameMode: '15 + 10 Rapid',
		gameDuration: '10 hours',
		gameType: 'Private',
		gameMembers: '25 players',
		timeLeft: '09:00:14'
	};
	let timeLeft = tournamentInfo.timeLeft;
</script>

<h1 class="mb-4 text-center text-2xl font-bold capitalize">Atomic Shield</h1>
<div class=" mx-auto h-full min-h-[110px] w-full max-w-[354px] rounded-xl bg-blue-500 py-5">
	<div class="mx-auto w-fit text-center">
		<Trophy class="mx-auto" />
		<Badge class="my-2">Badge</Badge>
		<h1 class="text-2xl font-bold">(#) 5000</h1>
	</div>
</div>
<div class="rounded-lg bg-black py-6 font-sans text-white">
	<h2 class="mb-6 font-medium">Tournament Info</h2>

	<div class="space-y-4">
		{#each Object.entries(tournamentInfo) as [key, value]}
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
		{#each { length: 5 } as _}
			<Table.Row>
				<Table.Cell class="flex w-full  items-center gap-1 truncate font-medium">
					<img src="./avatar.png" class="size-10" alt="" />
					<p class="text-xs font-medium">@Grand_Maestro</p>
				</Table.Cell>
				<Table.Cell class="text-sm font-medium text-white">3000</Table.Cell>
				<Table.Cell class="text-sm font-medium text-green-500">2800</Table.Cell>
				<Table.Cell class="text-sm font-medium text-white">200</Table.Cell>
				<Table.Cell class="text-sm font-medium text-red-500">99</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
