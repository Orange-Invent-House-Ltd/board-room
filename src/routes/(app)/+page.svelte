<script lang="ts">
	import { BellIcon, ChevronRight } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import ProfileDrawer from '$lib/components/Drawers/ProfileDrawer.svelte';
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-medium">Home</h1>
	<div class="flex items-center gap-5">
		<a href="/notification" class="rounded border border-gray-200 p-1">
			<BellIcon class="h-6 w-6" />
		</a>
		<ProfileDrawer />
	</div>
</div>
<h2 class="py-5 font-medium">Daily Puzzle</h2>
<div class="relative">
	<div
		class="absolute left-1/2 top-1/2 flex w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3"
	>
		<button
			class="h-[43px] w-full rounded-3xl border border-white bg-[#3574F5] px-5 font-medium text-white"
		>
			Continue playing
		</button>
		<button
			class="h-[43px] w-full rounded-3xl border border-white bg-[#2E2E30] px-5 font-medium text-white"
		>
			Play later
		</button>
	</div>
	<img src="/chessStatic.svg" class="w-full" alt="" />
</div>

<div class="flex items-center justify-between pb-3 pt-5">
	<h3 class="text-lg font-medium">Open Tournaments</h3>
	<Button class="text-white" variant="ghost">
		View more <ChevronRight class="size-5" />
	</Button>
</div>
<Table.Root>
	<Table.Header>
		<Table.Row class="text-nowrap text-sm font-medium">
			<Table.Head class=" text-[#C6C6C6]">Tournament name</Table.Head>
			<Table.Head class="text-[#C6C6C6]">Time left</Table.Head>
			<Table.Head class="w-fit text-[#C6C6C6]">Duration</Table.Head>
			<Table.Head class="text-[#C6C6C6]">No.players</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each { length: 5 } as _, i}
			<Table.Row class="text-nowrap text-right text-xs text-[#ffffff]">
				<Table.Cell class=" font-semibold ">{i + 1} @Grand_Maestro</Table.Cell>
				<Table.Cell class="">25 minutes</Table.Cell>
				<Table.Cell class="w-fit  ">2 hours</Table.Cell>
				<Table.Cell class="text-left">10</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<div class="mt-5 flex items-center justify-between pb-4">
	<h3 class="text-lg font-medium">This Week’s Leaderboard</h3>
</div>
<Tabs.Root value="chess" class="">
	<Tabs.List>
		<Tabs.Trigger value="chess">Chess</Tabs.Trigger>
		<Tabs.Trigger value="checkers">Checkers</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="chess">
		<div class="flex w-full items-center justify-between py-5">
			<div class="text-center">
				<img class="w-full" src="./avatar-big.svg" alt="" />
				<p class="mt-3 font-medium">@Adebola</p>
			</div>
			<div class="text-center">
				<img class="w-full" src="./avatar-big.svg" alt="" />
				<p class="mt-3 font-medium">@Adebola</p>
			</div>
			<div class="text-center">
				<img class="w-full" src="./avatar-big.svg" alt="" />
				<p class="mt-3 font-medium">@Adebola</p>
			</div>
		</div>
	</Tabs.Content>
	<Tabs.Content value="checkers">
		<div class="flex items-center justify-between py-5">
			<div class="text-center">
				<img src="./avatar-big.svg" alt="" />
				<p class="mt-3 font-medium">@Adebola</p>
			</div>
			<div class="text-center">
				<img src="./avatar-big.svg" alt="" />
				<p class="mt-3 font-medium">@Adebola</p>
			</div>
			<div class="text-center">
				<img src="./avatar-big.svg" alt="" />
				<p class="mt-3 font-medium">@Adebola</p>
			</div>
		</div>
	</Tabs.Content>
	<div class="flex w-full items-center justify-center">
		<Button class="mx-auto w-fit rounded-3xl" variant="outline">View full leaderboard</Button>
	</div>
</Tabs.Root>
<div class="mt-10 rounded-lg bg-[#A9692F] p-4">
	<h2 class="mb-2 font-semibold">Fund Your Wallet!</h2>
	<p class="mb-2 text-sm">
		Take advantage of this opportunity to fund your wallet and stake more to increase your
		excitement and rewards.
	</p>
	<button
		type="button"
		class="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#A9692F]"
		>Fund wallet</button
	>
</div>

<h2 class="mb-5 mt-10 font-medium">Play Checkers Now</h2>
<div class="relative">
	<div
		class="absolute left-1/2 top-1/2 flex w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3"
	>
		<button
			class="h-[43px] w-full rounded-3xl border border-white bg-[#3574F5] px-5 font-medium text-white"
		>
			Continue playing
		</button>
		<button
			class="h-[43px] w-full rounded-3xl border border-white bg-[#2E2E30] px-5 font-medium text-white"
		>
			Play later
		</button>
	</div>
	<img src="/checkers.svg" class="w-full" alt="" />
</div>
