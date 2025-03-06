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
	let showModal = $state(false);
	let matchComplete = $state(false);
	let socket: WebSocket;

	const roomId = $page.params.roomId;
	const tournamentId = $page.params.id;

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

	function handleRoundResult(data: any) {
		console.log('Received round result:', data);
		const { moves, winner, yourRole } = data;

		// Set choices based on player role
		userChoice = yourRole === 'player1' ? moves.player1 : moves.player2;
		opponentChoice = yourRole === 'player1' ? moves.player2 : moves.player1;

		userIconBounce = false;
		opponentIconBounce = false;
		roundsPlayed++;

		// Determine result based on winner and player role
		if (winner === 'draw') {
			draw++;
			resultMessage = "It's a draw!";
			subMessage = `Both players chose ${userChoice}`;
		} else if (winner === yourRole) {
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
			winner,
			yourRole,
			result: resultMessage,
			stats: { won, lost, draw }
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
		goto(`/tournament/${tournamentId}/lobby`);
	}
</script>

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

	.modal {
		display: none;
		position: fixed;
		z-index: 100;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.7);
	}

	.modal.show {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		background-color: #1e1e1e;
		border-radius: 12px;
		padding: 24px;
		width: 90%;
		max-width: 500px;
		text-align: center;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
		border: 1px solid #333;
	}

	.modal-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 16px 0;
	}

	.modal-message {
		margin-bottom: 16px;
		font-size: 1.2rem;
	}

	.modal-stats {
		display: flex;
		justify-content: space-around;
		margin: 20px 0;
	}

	.stat {
		font-weight: 600;
	}

	.modal-button {
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 25px;
		padding: 12px 24px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.modal-button:hover {
		background-color: #2563eb;
	}
</style>
