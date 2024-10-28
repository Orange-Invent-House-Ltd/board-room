<!-- src/routes/game/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Chess } from 'svelte-chess';
	import Timer from '$lib/components/Timer.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import Pusher from 'pusher-js';
	import { enhance } from '$app/forms';
	// src/types/chess.ts
	interface Move {
		color: 'w' | 'b';
		from: string;
		to: string;
		piece: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
		captured?: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
		promotion?: 'n' | 'b' | 'r' | 'q';
		san: string;
		lan: string;
		before: string;
		after: string;
		flags: string;
		check: boolean;
		checkmate: boolean;
	}
	let TimeRanOut = false;

	let chess: Chess;
	let whiteTime = 300; // 5 minutes
	let blackTime = 300;
	let increment = 0;
	let gameId = '';
	let playerColor: 'w' | 'b' = 'w';
	let pusher: Pusher;
	let channel: any;

	onMount(() => {
		const url = new URL(window.location.href);
		const timeControl = url.searchParams.get('timeControl') || '5 0';
		const [baseTime, inc] = timeControl.split(' ').map(Number);
		whiteTime = baseTime * 60;
		blackTime = baseTime * 60;
		increment = inc;
		gameId = url.searchParams.get('gameId') || '';
		playerColor = (url.searchParams.get('color') || 'w') as 'w' | 'b';

		if (gameId) {
			pusher = new Pusher('056f790af8d3aaa84833', {
				cluster: 'mt1'
			});
			channel = pusher.subscribe(`my-channel`);
			channel.bind('move', (data) => {
				console.log('🚀 ~ channel.bind ~ data:', data);
				chess.load(data.move);
			});
		}
	});

	async function moveListener(event: any) {
		console.log('🚀 ~ moveListener ~ event:', event);
		const move = event.detail;
		if (move.color === 'w') {
			whiteTime += increment;
		} else {
			blackTime += increment;
		}

		// Send the move to the server
		await fetch('/api/move', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ move: move.after })
		});
		chess.move(move.after);

		// Update the Chess component with the move
	}
	function gameOverListener(event: CustomEvent<{ reason: string; result: number }>) {
		console.log('Game Over:', event.detail.reason);
		// Implement game over logic (e.g., show a modal, update scores)
	}

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function handleTimerExpired(color: 'white' | 'black') {
		if (TimeRanOut) return; // Prevent multiple calls
		TimeRanOut = true;
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

<form action="/realtime" method="post" use:enhance>
	<Button type="submit">click</Button>
</form>
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
			paused={playerColor === 'b'}
			onExpired={() => handleTimerExpired('white')}
		/>
	</div>
	<div class="my-2">
		<Chess
			bind:this={chess}
			on:move={async (e) => {
				moveListener(e);
			}}
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
			paused={playerColor === 'w'}
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
