<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { formatNaira } from '$lib/utils';
	import AboutRps from './components/AboutRps.svelte';
	let { data } = $props();
	let hideAboutRps = $state(false);
	const playOptions = [
		{
			icon: './circleComputer.svg',
			title: 'Play with computer',
			subTitle: 'Play against our ever smart AI bots now.',
			href: 'play-with-computer',
			action: 'playWithComputer'
		},
		{
			icon: './playWithFriends.svg',
			title: 'Play with Friend',
			subTitle: 'Create and play your favorite game with a friend now.',
			href: 'play-with-friend',
			action: 'redirect'
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
			href: 'create-tournament',
			action: 'redirect'
		},
		{
			icon: './instantPlay.svg',
			title: 'Instant play',
			subTitle: 'Create and play your favourite game at a later time.',
			href: 'instant-play'
		}
	];
</script>

<!-- <div
	hidden={hideAboutRps}
	class="absolute left-0 right-0 top-0 z-50 mx-auto h-screen max-w-md overflow-auto bg-background px-2 pt-10"
>
	<AboutRps onclick={() => (hideAboutRps = true)} />
</div> -->

<h1 class="mb-10 text-2xl font-medium">Rock, Paper, Scissors</h1>
<div class="grid grid-cols-2 gap-3 sm:gap-5">
	{#each playOptions as { icon, subTitle, title, href, action }}
		<form use:enhance action="?/{action}" method="POST">
			<input hidden name="href" value={'rps/' + href} />

			<button
				class=" inline-block w-full space-y-1 rounded-md border border-[#6D6D6E] px-3 py-[18px] text-left"
			>
				<img src={icon} alt="" />
				<p class="text-sm font-semibold">{title}</p>
				<p class="mt-1 text-[10px] font-light">{subTitle}</p>
			</button>
		</form>
	{/each}
</div>

<div class="mt-10">
	<p class="mb-4">Quick pairing</p>

	<div class="space-y-4">
		{#each data.tournaments as tournament}
			<div class="rounded-md border border-[#AFAFAF] p-4">
				<div class="mb-2 flex justify-between text-sm font-medium">
					<p>{tournament.name}</p>
					<p>
						{#if !tournament.fee}
							(#)Free
						{:else}
							{formatNaira(tournament.fee)}
						{/if}
					</p>
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
						<img src="/lock.svg" alt="" />
						<span class="font-medium">Public</span>
					</p>
					<p>2 users joined</p>
				</div>
			</div>
		{/each}
	</div>
</div>
