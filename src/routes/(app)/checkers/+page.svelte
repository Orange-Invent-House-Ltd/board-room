<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AboutRps from './components/AboutRps.svelte';

	let hideAboutRps = $state(false);
	const playOptions = [
		{
			icon: './circleComputer.svg',
			title: 'Play with computer',
			subTitle: 'Play against our ever smart AI bots now.',
			href: 'play-with-computer'
		},
		{
			icon: './playWithFriends.svg',
			title: 'Play with Friend',
			subTitle: 'Create and play your favorite game with a friend now.',
			href: 'play-with-friend'
		},
		{
			icon: './schedule.svg',
			title: 'Schedule game',
			subTitle: 'Schedule and play your favorite game at a later time.',
			href: 'schedule-game'
		},
		{
			icon: './circleTournament.svg',
			title: 'Create tournament',
			subTitle: 'Create and play your favourite game with a friend now.',
			href: 'create-tournament'
		},
		{
			icon: './dialyChallenge.svg',
			title: 'Daily challenge',
			subTitle: 'Play your favourite game with our smartest AI bots now.',
			href: 'daily-challenge'
		},
		{
			icon: './instantPlay.svg',
			title: 'Instant play',
			subTitle: 'Create and play your favourite game at a later time.',
			href: 'instant-play'
		}
	];
</script>

<h1 class="mb-10 text-2xl font-medium">Checkers</h1>
<div class="grid grid-cols-2 gap-3 sm:gap-5">
	{#each playOptions as { icon, subTitle, title, href }}
		<a
			href="/checkers/{href}"
			class=" w-full space-y-1 rounded-md border border-[#6D6D6E] px-3 py-[18px]"
		>
			<img src={icon} alt="" />
			<p class="text-sm font-semibold">{title}</p>
			<p class="mt-1 text-[10px] font-light">{subTitle}</p>
		</a>
	{/each}
</div>

<div class="mt-10">
	<p class="mb-4">Quick pairing</p>

	<div class="space-y-4">
		{#each { length: 5 } as _}
			<div class="rounded-md border border-[#AFAFAF] p-4">
				<div class="mb-2 flex justify-between text-sm font-medium">
					<p>Loser pay</p>
					<p>(#)Free</p>
				</div>
				<p class="mb-2 flex items-center gap-5 text-xs text-[#AFAFAF]">
					<img src="/people.svg" alt="" />
					<span class="font-medium">2</span>
				</p>
				<p class="mb-2 flex items-center gap-5 text-xs text-[#AFAFAF]">
					<img src="/clock.svg" alt="" />
					<span class="font-medium">5 hours</span>
				</p>
				<div class="mb-2 flex items-center justify-between text-xs text-[#AFAFAF]">
					<p class="flex items-center gap-5">
						<img src="/lock.svg" alt="" />
						<span class="font-medium">Public</span>
					</p>
					<p>2 users joined</p>
				</div>
			</div>
		{/each}
	</div>
</div>
