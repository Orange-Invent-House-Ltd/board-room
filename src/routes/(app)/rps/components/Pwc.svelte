<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import Results from './Results.svelte';
	let won = $state(0);
	let lost = $state(0);
	let draw = $state(0);
	let userChoice: string | null = $state(null);
	let computerChoice: string | null = $state(null);
	let resultMessage: string | null = $state(null);
	let animate = $state(false);

	async function playGame(choice: string) {
		animate = true;
		resultMessage = '';
		userChoice = null;
		computerChoice = null;
		await delay(2000);

		// Stop animation
		animate = false;

		userChoice = choice;
		const choices = ['rock', 'paper', 'scissors'];
		const randomIndex = Math.floor(Math.random() * choices.length);
		computerChoice = choices[randomIndex];

		// Determine the result
		if (userChoice === computerChoice) {
			draw += 1;
			await fetch('/api/rps/plw', {
				method: 'POST',
				body: JSON.stringify({
					winner: false,
					draw: true,
					gameHistoryId: $page.url.searchParams.get('gh')
				})
			});
			resultMessage = `It's a draw`;
		} else if (
			(userChoice === 'rock' && computerChoice === 'scissors') ||
			(userChoice === 'paper' && computerChoice === 'rock') ||
			(userChoice === 'scissors' && computerChoice === 'paper')
		) {
			won += 1;
			await fetch('/api/rps/plw', {
				method: 'POST',
				body: JSON.stringify({ winner: true, gameHistoryId: $page.url.searchParams.get('gh') })
			});
			resultMessage = `You win`;
		} else {
			lost += 1;
			await fetch('/api/rps/plw', {
				method: 'POST',
				body: JSON.stringify({ winner: false, gameHistoryId: $page.url.searchParams.get('gh') })
			});
			resultMessage = `You lose!`;
		}
	}
	// Utility function to create a delay
	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

{#if resultMessage}
	<div transition:slide>
		<Results {computerChoice} {draw} {lost} bind:resultMessage {userChoice} {won} />
	</div>
{:else}
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

		<img src="/robot.svg" class="mx-auto my-[60px] w-fit rounded-full" alt="" />
		<p class="mb-[60px] text-center text-3xl font-bold">VS</p>

		<div
			class={cn('flex  items-center justify-between', {
				'animate-bounce': animate
			})}
		>
			<button onclick={() => playGame('rock')}>
				<img src="/rock.svg" class="mx-auto w-fit rounded-full" alt="" />
				<p class="mt-2 text-center text-sm font-medium uppercase">Rock</p>
			</button>
			<button onclick={() => playGame('paper')}>
				<img src="/paper.svg" class="mx-auto w-fit rounded-full" alt="" />
				<p class="mt-2 text-center text-sm font-medium uppercase">Paper</p>
			</button>
			<button onclick={() => playGame('scissors')}>
				<img src="/scissors.svg" class="mx-auto w-fit rounded-full" alt="" />
				<p class="mt-2 text-center text-sm font-medium uppercase">SCISSORS</p>
			</button>
		</div>
		<!-- {#if userChoice && computerChoice}
			<p class="my-4 text-lg">You chose: <strong>{userChoice}</strong></p>
			<p class="text-lg">Computer chose: <strong>{computerChoice}</strong></p>
		{/if} -->

		<p class="my-5 text-center text-xs font-medium">
			Tap on either the “Rock”, “Paper” or “Scissors” to choose.
		</p>
		<form
			use:enhance
			method="POST"
			action={`?/abortGame`}
			class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5"
		>
			<input type="text" name="gh" value={$page.url.searchParams.get('gh')} hidden />
			<Button type="submit" class="w-full rounded-full bg-blue-600 py-3 text-white"
				>Abort game</Button
			>
		</form>
	</div>
{/if}

<style>
	.animate-bounce {
		animation: bounce 0.5s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
