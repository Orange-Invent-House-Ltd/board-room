<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';

	type Props = {
		won: number;
		lost: number;
		draw: number;
		userChoice: string | null;
		computerChoice: string | null;
		resultMessage: string | null;
		subMessage: string;
	};
	let {
		computerChoice,
		draw,
		lost,
		userChoice,
		won,
		resultMessage = $bindable(),
		subMessage
	}: Props = $props();
</script>

<div class="">
	<div class="flex w-full items-center justify-between">
		<div class="text-center text-lg font-semibold">
			<p class="text-[#8C8C8C]">WON</p>
			<p class="text-[25px]">{won}</p>
		</div>
		<div class="text-center text-lg font-semibold">
			<p class="text-[#8C8C8C]">LOST</p>
			<p class="text-[25px]">{lost}</p>
		</div>
		<div class="text-center text-lg font-semibold">
			<p class="text-[#8C8C8C]">DRAW</p>
			<p class="text-[25px]">{draw}</p>
		</div>
	</div>

	<div class="mx-auto my-[60px] w-fit text-center">
		<h1 class="text-4xl font-bold">{resultMessage}</h1>
		<p>{subMessage}</p>
	</div>
	<div class="mb-[60px] flex justify-between">
		{#if userChoice === 'rock' && computerChoice === 'scissors'}
			<img src="/rockLg.svg" alt="Rock" />
			<img src="/scissorsLg.svg" alt="Scissors" />
		{:else if userChoice === 'rock' && computerChoice === 'paper'}
			<img src="/paperLg.svg" alt="Paper" />
			<img src="/rockLg.svg" alt="Rock" />
		{:else if userChoice === 'scissors' && computerChoice === 'paper'}
			<img src="/scissorsLg.svg" class="scale-x-[-1]" alt="Scissors" />
			<img src="/paperLg.svg" alt="Paper" />
		{:else if userChoice === 'scissors' && computerChoice === 'rock'}
			<img src="/rockLg.svg" alt="Rock" />
			<img src="/scissorsLg.svg" alt="Scissors" />
		{:else if userChoice === 'paper' && computerChoice === 'rock'}
			<img src="/paperLg.svg" alt="Paper" />
			<img src="/rockLg.svg" alt="Rock" />
		{:else if userChoice === 'paper' && computerChoice === 'scissors'}
			<img src="/scissorsLg.svg" alt="Scissors" />
			<img src="/paperLg.svg" alt="Paper" />
		{:else if userChoice === computerChoice}
			<img src="/{userChoice}Lg.svg" class="scale-x-[-1]" alt={userChoice} />
			<img src="/{computerChoice}Lg.svg" alt={computerChoice} />
		{/if}
	</div>
	<form
		use:enhance={({}) => {
			return async ({ update }) => {
				await update();
				resultMessage = null;
			};
		}}
		method="POST"
		action={`/rps?/startGame`}
		class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5"
	>
		<input hidden name="href" value={'/rps/' + 'play-with-computer'} />

		<Button type="submit" class="w-full rounded-full bg-blue-600 py-3 text-white">Play again</Button
		>
	</form>
</div>
