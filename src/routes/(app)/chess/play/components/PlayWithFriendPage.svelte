<script lang="ts">
	import { browser } from '$app/environment';
	import Chess from '$lib/chessApi/Chess.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pusher from 'pusher-js';
	import { onMount } from 'svelte';

	let chess: Chess;
	let isWhiteTurn = $state(true);
	let whiteTime = $state(0);
	let blackTime = $state(0);
	let increment = $state(0);
	let gameId = $state('');
	let playerColor = $state('');
	let pusher: Pusher;
	let channel: any;

	// Parse time control and game ID from URL
	function updateGameSettings() {
		const timeControl = $page.url.searchParams.get('timeControl') || '5 0';
		const [baseTime, inc] = timeControl.split(' ').map(Number);
		whiteTime = baseTime * 60;
		blackTime = baseTime * 60;
		increment = inc;
		gameId = $page.url.searchParams.get('gameId') || '';
		playerColor = $page.url.searchParams.get('color') || '';
	}

	// Initial call to set up game settings
	updateGameSettings();

	$effect(() => {
		updateGameSettings();
	});

	onMount(() => {
		if (browser && gameId) {
			pusher = new Pusher('YOUR_PUSHER_KEY', {
				cluster: 'YOUR_PUSHER_CLUSTER'
			});
			channel = pusher.subscribe(`game-${gameId}`);
			channel.bind('move', (data: { move: any }) => {
				chess.move(data.move);
			});
		}
	});

	async function moveListener(event) {
		const move = event.detail;
		if (move.color === 'w') {
			whiteTime += increment;
			isWhiteTurn = false;
		} else {
			blackTime += increment;
			isWhiteTurn = true;
		}

		// Send the move to the server
		await fetch('/api/move', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ gameId, move })
		});
	}

	function gameOverListener(event) {
		console.log('Game Over:', event.detail.reason);
		// Implement game over logic (e.g., show a modal, update scores)
	}

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function handleTimerExpired(color: 'white' | 'black') {
		chess.reset();
		console.log(`${color}'s time has expired`);
		// Implement game over logic here
	}

	async function createNewGame() {
		const timeControl = '5 0'; // Default time control, you can make this customizable
		const response = await fetch('/api/create-game', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ timeControl })
		});
		const { gameId, playerColor } = await response.json();
		goto(`/game?timeControl=${timeControl}&gameId=${gameId}&color=${playerColor}`);
	}

	function copyGameLink() {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			alert('Game link copied to clipboard!');
		});
	}
</script>

// src/routes/game/+page.svelte
<div class="mb-5 flex items-center gap-5">
	<h1 class="text-lg font-medium">Time Control</h1>
	<p class="text-2xl">{formatTime(whiteTime)} + {increment}</p>
</div>
<div class="">
	<div class="flex items-center gap-2 pl-2">
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>W</Avatar.Fallback>
		</Avatar.Root>
		<p>White</p>
		<Timer
			bind:seconds={whiteTime}
			classes=""
			paused={!isWhiteTurn}
			onExpired={() => handleTimerExpired('white')}
		/>
	</div>
	<div class="my-2">
		<Chess
			bind:this={chess}
			on:move={moveListener}
			on:gameOver={gameOverListener}
			orientation={playerColor}
		/>
	</div>
	<div class="flex items-center gap-2 pl-2">
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>B</Avatar.Fallback>
		</Avatar.Root>
		<p>Black</p>
		<Timer
			bind:seconds={blackTime}
			classes=""
			paused={isWhiteTurn}
			onExpired={() => handleTimerExpired('black')}
		/>
	</div>
	<div class="fixed bottom-0 left-0 z-50 w-full border-t bg-background px-5 py-5">
		{#if !gameId}
			<Button class="w-full rounded-full" on:click={createNewGame}>Create New Game</Button>
		{:else}
			<Button class="w-full rounded-full" on:click={copyGameLink}>Copy Game Link</Button>
		{/if}
	</div>
</div>
