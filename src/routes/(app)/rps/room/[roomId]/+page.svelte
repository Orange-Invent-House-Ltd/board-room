<script lang="ts">
	import { page } from '$app/stores';
	import { pusherClient } from '$lib/pusher';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
let {data} = $props()
	// State variables
	// State variables
let won = $state(0);
let lost = $state(0);
let draw = $state(0);
let roundsPlayed = $state(0);
const totalRounds = data.friendGame.numberOfRounds;
let userChoice: string | null = $state(null);
let opponentChoice: string | null = $state(null);
let resultMessage: string | null = $state(null);
let subMessage = $state('');
let userIconBounce = $state(false);
let opponentIconBounce = $state(false);
	// Generate a unique ID for each player
	const playerId = crypto.randomUUID();
	const roomId = $page.params.roomId;

	// Subscribe to the Pusher channel
	$effect(() => {
		if (!roomId) return;

		const channel = pusherClient.subscribe(`rps-room-${roomId}`);

		channel.bind('player-move', ({ player, choice }: { player: string; choice: string }) => {
			// Update opponent's state if the move came from the other player
			if (player !== playerId) {
				opponentChoice = choice;
				opponentIconBounce = true;

				if (userChoice && opponentChoice) {
					// Both players have played
					setTimeout(() => calculateResult(), 3000);
				}
			}
		});

		return () => pusherClient.unsubscribe(`rps-room-${roomId}`);
	});

	// Player makes a choice
	async function playGame(choice: string) {
		if (userChoice) return; // Prevent duplicate moves
		userChoice = choice;
		userIconBounce = true;

		// Send the move to the opponent
		await fetch(`/api/rps/play`, {
			method: 'POST',
			body: JSON.stringify({ roomId, choice, playerId })
		});

		// Check if opponent has already played
		if (opponentChoice) {
			setTimeout(() => calculateResult(), 3000);
		}
	}

	// Calculate game result
	// Calculate game result
function calculateResult() {
    // Reset bounce animations
    userIconBounce = false;
    opponentIconBounce = false;
    roundsPlayed += 1;

    if (userChoice === opponentChoice) {
        draw += 1;
        resultMessage = `It's a draw!`;
        subMessage = `Both players chose ${userChoice}`;
    } else if (
        (userChoice === 'rock' && opponentChoice === 'scissors') ||
        (userChoice === 'paper' && opponentChoice === 'rock') ||
        (userChoice === 'scissors' && opponentChoice === 'paper')
    ) {
        won += 1;
        resultMessage = `You win!`;
        subMessage = `${userChoice} beats ${opponentChoice}`;
    } else {
        lost += 1;
        resultMessage = `You lose!`;
        subMessage = `${opponentChoice} beats ${userChoice}`;
    }

    // Check if the game has reached the total number of rounds
    if (roundsPlayed >= totalRounds) {
        setTimeout(() => determineOverallWinner(), 3000);
    } else {
        // Reset game state after 3 seconds
        setTimeout(() => {
            userChoice = null;
            opponentChoice = null;
            resultMessage = null;
            subMessage = null;
        }, 3000);
    }
}
// Determine overall winner
function determineOverallWinner() {
    let overallResult;
    if (won > lost) {
        overallResult = 'win';
    } else if (lost > won) {
        overallResult = 'lose';
    } else {
        overallResult = 'draw';
    }

    // Log the result to the database
    fetch('/api/rps/logResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId, overallResult, won, lost, draw })
    });

    // Reset state
    won = 0;
    lost = 0;
    draw = 0;
    roundsPlayed = 0;
    userChoice = null;
    opponentChoice = null;
    resultMessage = `Overall Result: ${overallResult}`;
    subMessage = `Won: ${won}, Lost: ${lost}, Draw: ${draw}`;
}

</script>
{data.friendGame.numberOfRounds}
<div class="game">
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

	<Avatar.Root
		class={cn('mx-auto my-[60px] size-20 rounded-full', { 'animate-bounce': opponentIconBounce })}
	>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<p class="mb-[60px] text-center text-3xl font-bold">VS</p>

	<div class={cn('flex  items-center justify-between')}>
		<button
			class={cn({ 'animate-bounce': userIconBounce && userChoice === 'rock' })}
			onclick={() => playGame('rock')}
		>
			<img src="/rock.svg" class="mx-auto w-fit rounded-full" alt="" />

			<p class="mt-2 text-center text-sm font-medium uppercase">Rock</p>
		</button>
		<button
			class={cn({ 'animate-bounce': userIconBounce && userChoice === 'paper' })}
			onclick={() => playGame('paper')}
		>
			<img src="/paper.svg" class="mx-auto w-fit rounded-full" alt="" />

			<p class="mt-2 text-center text-sm font-medium uppercase">Paper</p>
		</button>
		<button
			class={cn({ 'animate-bounce': userIconBounce && userChoice === 'scissors' })}
			onclick={() => playGame('scissors')}
		>
			<img src="/scissors.svg" class="mx-auto w-fit rounded-full" alt="" />
			<p class="mt-2 text-center text-sm font-medium uppercase">SCISSORS</p>
		</button>
	</div>
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
		<Button type="submit" class="w-full rounded-full bg-blue-600 py-3 text-white">Abort game</Button
		>
	</form>
	{#if resultMessage}
		<div class="result">
			<p>{resultMessage}</p>
			<p>{subMessage}</p>
		</div>
	{/if}
</div>

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
