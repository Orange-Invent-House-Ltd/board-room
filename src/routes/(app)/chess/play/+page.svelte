<script lang="ts">
	import { browser } from '$app/environment';
	import Chess, { Engine, type UciEvent } from '$lib/chessApi/Chess.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
	let TimeRanOut = $state(false);
	let chess: Chess;
	let isComputerTurn = $state(true); // Computer plays white
	let computerTime = $state(0);
	let playerTime = $state(0);
	let increment = $state(0);

	// Parse time control from URL
	function updateTimeControl() {
		const timeControl = $page.url.searchParams.get('timeControl') || '5 0';
		const [baseTime, inc] = timeControl.split(' ').map(Number);
		computerTime = baseTime * 60;
		playerTime = baseTime * 60;
		increment = inc;
	}

	// Initial call to set up time control
	updateTimeControl();

	$effect(() => {
		updateTimeControl();
	});

	// Calculate engine's move time based on remaining time
	let moveTime = $derived(Math.min((computerTime * 1000) / 40, 2000)); // Max 2 seconds per move

	const engine = new Engine({
		depth: 12, // Reduced depth for faster responses
		moveTime,
		color: 'w' // Computer plays as white
	});

	function gameOverListener(event) {
		console.log('Game Over:', event.detail.reason);
		TimeRanOut = true;
		engine.stopSearch();
	}

	function moveListener(event) {
		if (TimeRanOut) return;

		const move = event.detail;

		// Ignore moves if it's not the correct turn
		if ((move.color === 'w') !== isComputerTurn) {
			console.log('Wrong turn, ignoring move');
			return;
		}

		if (move.color === 'w') {
			// Computer's move (white)
			computerTime += increment;
			isComputerTurn = false;
		} else {
			// Player's move (black)
			playerTime += increment;
			isComputerTurn = true;
			// Let engine analyze after player's move
			if (!TimeRanOut && chess) {
				setTimeout(() => {
					engine.analyze(chess.getFen());
				}, 100); // Small delay to ensure UI updates
			}
		}
	}

	// Initialize the game when component mounts
	$effect(() => {
		if (chess && isComputerTurn) {
			// Make first move if computer is white
			setTimeout(() => {
				// Replace engine.makeMove with engine.analyze
				engine.analyze(chess.getFen());
			}, 500);
		}
	});

	// Output all UCI messages
	let uciMessages: { text: string; type: string }[] = [];
	function handleUci(event: UciEvent) {
		uciMessages = [
			{
				text: event.detail,
				type: event.detail.split(' ')[0]
			},
			...uciMessages
		];
	}

	$effect(() => {
		if (browser) {
			const handleBeforeUnload = (event) => {
				event.preventDefault();
				return (event.returnValue = 'Are you sure you want to reload? Your state might be lost.');
			};

			window.addEventListener('beforeunload', handleBeforeUnload);

			return () => {
				window.removeEventListener('beforeunload', handleBeforeUnload);
			};
		}
	});

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function handleTimerExpired(player: 'computer' | 'player') {
		if (TimeRanOut) return;
		TimeRanOut = true;
		chess.reset();
		console.log(`${player}'s time has expired`);
		engine.stopSearch();
	}
</script>

<div class="mb-5 flex items-center gap-5">
	<h1 class="text-lg font-medium">Time Control</h1>
	<p class="text-2xl">{formatTime(computerTime)} + {increment}</p>
</div>
<div class="">
	<div class="flex items-center gap-2 pl-2">
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<p>Computer</p>
		<Timer
			bind:seconds={computerTime}
			classes=""
			paused={!isComputerTurn}
			onExpired={() => handleTimerExpired('computer')}
		/>
	</div>
	<div class="my-2">
		<Chess
			bind:this={chess}
			on:move={moveListener}
			on:gameOver={gameOverListener}
			orientation="b"
			on:uci={handleUci}
			{engine}
		/>
	</div>
	<div class="flex items-center gap-2 pl-2">
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<p>Player</p>
		<Timer
			bind:seconds={playerTime}
			classes=""
			paused={isComputerTurn}
			onExpired={() => handleTimerExpired('player')}
		/>
	</div>
	<div class="fixed bottom-0 left-0 z-50 w-full border-t bg-background px-5 py-5">
		<Button class="w-full rounded-full">Abort game</Button>
	</div>
</div>
