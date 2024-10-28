<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import { queryParam } from 'sveltekit-search-params';
	const playOptions = [
		{
			icon: './chessPlayWithComputer.svg',
			title: 'Play with computer',
			subTitle: 'Create and play your favourite game instantly.',
			href: 'play-with-computer'
		},
		{
			icon: './playWithFriends.svg',
			title: 'Play with Friend',
			subTitle: 'Create and play your favourite game with a friend now.',
			href: 'play-with-friend'
		},
		{
			icon: './schedule.svg',
			title: 'Schedule game',
			subTitle: 'Schedule and play your favourite game at a later time.',
			href: 'schedule-game'
		},
		{
			icon: './circleTournament.svg',
			title: 'Create tournament',
			subTitle: 'Create and enjoy a  chess tournament now.',
			href: 'create-tournament'
		},
		{
			icon: './instantPlay.svg',
			title: 'Instant play',
			subTitle: 'Create and play your favourite game at a later time.',
			href: 'instant-play'
		}
	];

	const timeControls = [
		{
			name: 'Bullet',
			time: '1+0',
			baseTime: 60,
			increment: 0
		},
		{
			name: 'Bullet',
			time: '2+1',
			baseTime: 120,
			increment: 1
		},
		{
			name: 'Blitz',
			time: '3+0',
			baseTime: 180,
			increment: 0
		},
		{
			name: 'Blitz',
			time: '3+2',
			baseTime: 180,
			increment: 2
		},
		{
			name: 'Blitz',
			time: '5+0',
			baseTime: 300,
			increment: 0
		},
		{
			name: 'Blitz',
			time: '5+3',
			baseTime: 300,
			increment: 3
		},
		{
			name: 'Rapid',
			time: '10+2',
			baseTime: 600,
			increment: 2
		},
		{
			name: 'Rapid',
			time: '10+5',
			baseTime: 600,
			increment: 5
		},
		{
			name: 'Rapid',
			time: '15+10',
			baseTime: 900,
			increment: 10
		},
		{
			name: 'Classical',
			time: '30+0',
			baseTime: 1800,
			increment: 0
		},
		{
			name: 'Classical',
			time: '30+20',
			baseTime: 1800,
			increment: 20
		},
		{
			name: '',
			time: 'Custom',
			baseTime: 0,
			increment: 0
		}
	];
	const timeControl = queryParam('timeControl');
</script>

<h1 class="mb-10 text-2xl font-medium">Chess</h1>
<div class="grid grid-cols-2 gap-3 sm:gap-5">
	{#each playOptions as { icon, subTitle, title, href }}
		<a
			href="/chess/{href}"
			class=" w-full space-y-1 rounded-md border border-[#6D6D6E] px-3 py-[18px]"
		>
			<img src={icon} alt="" />
			<p class="text-sm font-semibold">{title}</p>
			<p class="mt-1 text-[10px] font-light">{subTitle}</p>
		</a>
	{/each}
</div>

<Tabs.Root value="paring" class="mt-10 w-full">
	<Tabs.List>
		<Tabs.Trigger value="paring">Quick paring</Tabs.Trigger>
		<Tabs.Trigger value="lobby">Lobby</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="paring">
		<div class=" grid grid-cols-4 gap-5">
			{#each timeControls as { name, time }}
				<a
					href="/chess/play?timeControl={time}"
					class="flex h-[60px] flex-col items-center justify-center rounded border border-[#6D6D6E] bg-[#2E2E30] hover:bg-[#4d4d4f]"
				>
					<p class="text-xs font-medium">{time}</p>
					<p class="text-[10px] font-light">{name}</p>
				</a>
			{/each}
		</div>
	</Tabs.Content>
	<Tabs.Content value="lobby">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class=" text-[#ffffff]">Player</Table.Head>
					<Table.Head class="text-[#ffffff]">Rating</Table.Head>
					<Table.Head class="text-[#ffffff]">Time</Table.Head>
					<Table.Head class="text-[#ffffff]">Mode</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each { length: 5 } as _}
					<Table.Row class="text-[#C6C6C6]">
						<Table.Cell>@Grand_Maestro</Table.Cell>
						<Table.Cell>3000</Table.Cell>
						<Table.Cell>2800</Table.Cell>
						<Table.Cell>200</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Tabs.Content>
</Tabs.Root>

<h2 class="mb-4 mt-10 text-base font-medium">Leaderboard</h2>
<Table.Root>
	<Table.Header>
		<Table.Row class="text-[#C6C6C6]">
			<Table.Head class="w-[100px text-[#C6C6C6]">Player</Table.Head>
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
