<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_WORKERS_URL } from '$env/static/public';
	import { goto } from '$app/navigation';

	// State variables
	let won = $state(0);
	let lost = $state(0);
	let draw = $state(0);
	let roundsPlayed = $state(0);
	let userChoice: string | null = $state(null);
	let opponentChoice: string | null = $state(null);
	let resultMessage: string | null = $state(null);
	let subMessage = $state('');
	let userIconBounce = $state(false);
	let opponentIconBounce = $state(false);
	let playerRole: 'player1' | 'player2' | null = $state(null);
	let gameActive = $state(false);
	let playersConnected = $state(0);
	let isMatchComplete = $state(false);
	let matchWinner: string | null = $state(null);
	let matchComplete = $state(false);
	let showModal = $state(false);

	let socket: WebSocket;

	const roomId = $page.params.roomId;

	function setupWebSocket() {
		const wsUrl = `ws://${PUBLIC_WORKERS_URL}/rps-room?roomId=${roomId}`;

		socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			console.log('Connected to game room');
			resultMessage = 'Connecting to game...';
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Received message:', data);

			switch (data.type) {
				case 'player-assigned':
					playerRole = data.role;
					playersConnected = data.playersConnected;
					console.log(`Assigned as ${playerRole}, Players connected: ${playersConnected}`);
					resultMessage = playersConnected < 2 ? 'Waiting for opponent...' : 'Game ready!';
					break;

				case 'game-ready':
					playersConnected = data.playersConnected;
					gameActive = true;
					isMatchComplete = false;
					matchWinner = null;
					resultMessage = 'Game ready! Make your choice.';
					break;

				case 'opponent-choice-made':
					opponentIconBounce = true;
					if (userChoice) {
						resultMessage = 'Both players have chosen!';
					} else {
						resultMessage = 'Opponent has made their choice!';
					}
					break;

				case 'round-result':
					handleRoundResult(data);
					break;

				case 'match-complete':
					handleMatchComplete(data.payload);
					break;

				case 'player-disconnected':
					gameActive = false;
					playersConnected = data.playersConnected;
					resultMessage = 'Opponent disconnected!';
					resetGameState();
					break;

				case 'match-end':
					resultMessage = 'Match ended!';
					matchComplete = true;
					showModal = true;
					break;
			}
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
			resultMessage = 'Connection error occurred!';
			gameActive = false;
		};

		socket.onclose = () => {
			console.log('Disconnected from game');
			resultMessage = 'Connection lost. Reconnecting...';
			gameActive = false;
			playerRole = null;
			playersConnected = 0;
			// Try to reconnect after a short delay
			setTimeout(setupWebSocket, 3000);
		};
	}
	function handleRoundResult(data: any) {
		console.log('Received round result:', data);
		const { moves, result } = data;

		userChoice = result.yourChoice;
		opponentChoice = result.opponentChoice;

		userIconBounce = false;
		opponentIconBounce = false;
		roundsPlayed++;

		// Update scores based on result
		if (result.isDraw) {
			draw++;
			resultMessage = "It's a draw!";
			subMessage = `Both players chose ${userChoice}`;
		} else if (result.isWinner) {
			won++;
			resultMessage = 'You win!';
			subMessage = `${userChoice} beats ${opponentChoice}`;
		} else {
			lost++;
			resultMessage = 'You lose!';
			subMessage = `${opponentChoice} beats ${userChoice}`;
		}

		console.log('Round result processed:', {
			userChoice,
			opponentChoice,
			result,
			stats: { won, lost, draw }
		});

		// Reset for next round after delay
		if (!data.isMatchComplete) {
			setTimeout(() => {
				userChoice = null;
				opponentChoice = null;
				resultMessage = 'Make your choice!';
				subMessage = '';
				userIconBounce = false;
				opponentIconBounce = false;
			}, 3000);
		}
	}

	function handleMatchComplete(data: any) {
		const { matchWinner, isWinner, finalScore, message } = data;

		gameActive = false;
		isMatchComplete = true;
		resultMessage = message;
		subMessage = `Final Score: ${won}-${lost}${draw > 0 ? ` (${draw} draws)` : ''}`;
		matchComplete = true;
		showModal = true;
		// Stop all animations
		userIconBounce = false;
		opponentIconBounce = false;
		userChoice = null;
		opponentChoice = null;

		// Optional: Display a more prominent message or trigger a celebration animation
		if (isWinner) {
			console.log('Match won!');
		}
	}

	function calculateResult() {
		userIconBounce = false;
		opponentIconBounce = false;
		roundsPlayed++;

		if (!userChoice || !opponentChoice) {
			console.error('Missing choices:', { userChoice, opponentChoice });
			return;
		}

		if (userChoice === opponentChoice) {
			draw++;
			resultMessage = "It's a draw!";
			subMessage = `Both players chose ${userChoice}`;
		} else if (
			(userChoice === 'rock' && opponentChoice === 'scissors') ||
			(userChoice === 'paper' && opponentChoice === 'rock') ||
			(userChoice === 'scissors' && opponentChoice === 'paper')
		) {
			won++;
			resultMessage = 'You win!';
			subMessage = `${userChoice} beats ${opponentChoice}`;
		} else {
			lost++;
			resultMessage = 'You lose!';
			subMessage = `${opponentChoice} beats ${userChoice}`;
		}

		console.log('Round result:', {
			userChoice,
			opponentChoice,
			result: resultMessage,
			playerRole
		});

		// Reset for next round after delay
		setTimeout(() => {
			userChoice = null;
			opponentChoice = null;
			resultMessage = 'Make your choice!';
			subMessage = '';
			userIconBounce = false;
			opponentIconBounce = false;
		}, 3000);
	}

	function resetGameState() {
		userChoice = null;
		opponentChoice = null;
		userIconBounce = false;
		opponentIconBounce = false;
	}

	// function handleRoundResult(data: any) {
	// 	console.log('Received round result:', data);
	// 	const { moves, winner, yourRole } = data;

	// 	// Set choices based on player role
	// 	userChoice = yourRole === 'player1' ? moves.player1 : moves.player2;
	// 	opponentChoice = yourRole === 'player1' ? moves.player2 : moves.player1;

	// 	userIconBounce = false;
	// 	opponentIconBounce = false;
	// 	roundsPlayed++;

	// 	// Determine result based on winner and player role
	// 	if (winner === 'draw') {
	// 		draw++;
	// 		resultMessage = "It's a draw!";
	// 		subMessage = `Both players chose ${userChoice}`;
	// 	} else if (winner === yourRole) {
	// 		won++;
	// 		resultMessage = 'You win!';
	// 		subMessage = `${userChoice} beats ${opponentChoice}`;
	// 	} else {
	// 		lost++;
	// 		resultMessage = 'You lose!';
	// 		subMessage = `${opponentChoice} beats ${userChoice}`;
	// 	}

	// 	console.log('Round result processed:', {
	// 		userChoice,
	// 		opponentChoice,
	// 		winner,
	// 		yourRole,
	// 		result: resultMessage,
	// 		stats: { won, lost, draw }
	// 	});

	// 	// Reset for next round after delay
	// 	setTimeout(() => {
	// 		userChoice = null;
	// 		opponentChoice = null;
	// 		resultMessage = 'Make your choice!';
	// 		subMessage = '';
	// 		userIconBounce = false;
	// 		opponentIconBounce = false;
	// 	}, 3000);
	// }

	async function playGame(choice: string) {
		if (!gameActive || userChoice || !socket || socket.readyState !== WebSocket.OPEN) {
			return;
		}

		console.log('Making move:', { choice, playerRole });
		userChoice = choice;
		userIconBounce = true;

		socket.send(
			JSON.stringify({
				type: 'player-move',
				choice
			})
		);

		resultMessage = 'Waiting for opponent...';
	}
	onMount(() => {
		setupWebSocket();
	});

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});
	function closeModal() {
		showModal = false;
		goto(`/tournament/${roomId}/lobby`);
	}
</script>

<a class="opacity-5" href="rps/winner"> e </a>
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

	<div class="text-center mt-4">
		<p class="text-sm font-medium text-gray-400">Round {roundsPlayed}/5</p>
	</div>

	<div class="text-center mb-4 mt-4">
		<p class="text-sm text-gray-400">
			{#if !playerRole}
				Connecting...
			{:else if playersConnected < 2}
				Waiting for opponent ({playersConnected}/2 players)
			{:else}
				Players connected: {playersConnected}/2
			{/if}
		</p>
	</div>

	<Avatar.Root
		class={cn('mx-auto my-[60px] size-20 rounded-full', { 'animate-bounce': opponentIconBounce })}
	>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>

	<p class="mb-[60px] text-center text-3xl font-bold">VS</p>

	<div class={cn('flex items-center justify-between', { 'opacity-50': !gameActive })}>
		<button
			disabled={!gameActive || userChoice !== null}
			class={cn('transition-transform', {
				'animate-bounce': userIconBounce && userChoice === 'rock'
			})}
			onclick={() => playGame('rock')}
		>
			<img src="/rock.svg" class="mx-auto w-fit rounded-full" alt="Rock" />
			<p class="mt-2 text-center text-sm font-medium uppercase">Rock</p>
		</button>

		<button
			disabled={!gameActive || userChoice !== null}
			class={cn('transition-transform', {
				'animate-bounce': userIconBounce && userChoice === 'paper'
			})}
			onclick={() => playGame('paper')}
		>
			<img src="/paper.svg" class="mx-auto w-fit rounded-full" alt="Paper" />
			<p class="mt-2 text-center text-sm font-medium uppercase">Paper</p>
		</button>

		<button
			disabled={!gameActive || userChoice !== null}
			class={cn('transition-transform', {
				'animate-bounce': userIconBounce && userChoice === 'scissors'
			})}
			onclick={() => playGame('scissors')}
		>
			<img src="/scissors.svg" class="mx-auto w-fit rounded-full" alt="Scissors" />
			<p class="mt-2 text-center text-sm font-medium uppercase">Scissors</p>
		</button>
	</div>

	<p class="my-5 text-center text-xs font-medium">
		{#if !gameActive}
			Waiting for opponent to join...
		{:else if userChoice}
			Waiting for opponent's choice...
		{:else}
			Tap on either Rock, Paper, or Scissors to make your choice
		{/if}
	</p>

	<form
		use:enhance
		method="POST"
		action="?/abortGame"
		class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5"
	>
		<input type="text" name="gh" value={$page.url.searchParams.get('gh')} hidden />
		<Button type="submit" class="w-full rounded-full bg-blue-600 py-3 text-white">Abort game</Button
		>
	</form>

	{#if resultMessage || subMessage}
		<div class="result mt-4 text-center">
			<p class="text-lg font-bold">{resultMessage}</p>
			{#if subMessage}
				<p class="mt-2 text-sm text-gray-400">{subMessage}</p>
			{/if}
		</div>
	{/if}
</div>
<div class="modal" class:show={showModal}>
	<div class="modal-content">
		<h3 class="modal-title">Match Complete</h3>
		<p class="modal-message">{resultMessage}</p>
		<div class="modal-stats">
			<div class="stat">Won: {won}</div>
			<div class="stat">Lost: {lost}</div>
			<div class="stat">Draw: {draw}</div>
		</div>
		<button class="modal-button" onclick={closeModal}>Return to Lobby</button>
	</div>
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

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
