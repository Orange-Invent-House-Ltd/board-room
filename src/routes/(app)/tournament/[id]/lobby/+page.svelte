<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { Message, TournamentMessage } from '$lib/types';
	import Chat from './components/Chat.svelte';
	import Overview from './components/Overview.svelte';
	import PairUps from './components/PairUps.svelte';
	import Players from './components/Players.svelte';
	import Rules from './components/Rules.svelte';
	import Timer from './components/Timer.svelte';

	let { data } = $props();
	let socket: WebSocket;
	let messages = $state<Message[]>([]);
	let playerId: number;
	let username = $page.data.userWithStats.username;

	// State for countdowns
	let tournamentStartCountdown = $state<string>('00:00');
	let roundCountdown = $state<string>('00:00');
	let isTournamentStarted = $state<boolean>(false);

	$effect(() => {
		if (browser) {
			playerId = $page.data.userWithStats.id;
			socket = new WebSocket(`ws://localhost:8787/tournament/${data.tournament.id}/connect`);

			socket.onopen = () => {
				console.log('WebSocket connected');
				console.log(
					'WebSocket connection established, about to send the joinTournament type with payload'
				);
				// Send a message to the server indicating the player has joined
				socket.send(
					JSON.stringify({
						type: 'JOIN_TOURNAMENT',
						payload: { playerId, username }
					})
				);
			};

			socket.onmessage = (event) => {
				const data = JSON.parse(event.data) as TournamentMessage;
				switch (data.type) {
					case 'CHAT_MESSAGE':
						console.log('some messages came in', data.payload);
						messages.push({
							...data.payload,
							id: crypto.randomUUID(),
							isMine: data.payload.playerId === playerId,
							text: data.payload.content,
							username: data.payload.username
						});
						break;
					case 'TOURNAMENT_START_COUNTDOWN':
						// Update tournament start countdown
						const remainingTime = data.payload.remainingTime;
						tournamentStartCountdown = formatTime(remainingTime);
						if (remainingTime <= 0) {
							isTournamentStarted = true;
						}
						break;
					case 'COUNTDOWN_UPDATE':
						// Update round countdown
						const roundRemainingTime = data.payload.remainingTime;
						roundCountdown = formatTime(roundRemainingTime);
						break;
					case 'JOIN_TOURNAMENT':
						console.log('let see how this works', data.payload);
						break;
					default:
				}
			};

			socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			socket.onclose = () => {
				console.log('WebSocket closed');
			};

			return () => {
				socket.close();
			};
		}
	});

	// Helper function to format time (milliseconds) into MM:SS
	function formatTime(remainingTime: number): string {
		if (remainingTime <= 0) return '00:00';
		const minutes = Math.floor(remainingTime / 60000);
		const seconds = Math.floor((remainingTime % 60000) / 1000);
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}

	function sendMessageToSocket(message: { playerId: number; content: string; username: string }) {
		if (socket) {
			socket.send(
				JSON.stringify({
					type: 'CHAT_MESSAGE',
					payload: message
				})
			);
		}
	}
</script>

<!-- Tournament Start Countdown -->
{#if !isTournamentStarted}
	<div class="countdown">
		Tournament starts in: {tournamentStartCountdown}
	</div>
{:else}
	<!-- Round Countdown -->
	<div class="countdown">
		Round Countdown: {roundCountdown}
	</div>
{/if}

<!-- Tabs and Other UI Components -->
<Tabs.Root value="overview" class="w-[400px]">
	<Tabs.List>
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="players">Players</Tabs.Trigger>
		<Tabs.Trigger value="rules">Rules</Tabs.Trigger>
		<Tabs.Trigger value="matches">Matches</Tabs.Trigger>
		<Tabs.Trigger value="chat">Chat</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="overview">
		<Overview
			tournamentName={data.tournament.name}
			tournamentFee={data.tournament.fee}
			gameType={data.tournament.type}
			startsIn={tournamentStartCountdown}
			currentPlayers={data.tournament.currentPlayers}
			maxPlayers={data.tournament.maxPlayers}
		/>
	</Tabs.Content>
	<Tabs.Content value="players">
		<Players players={data.tournament.participants} />
	</Tabs.Content>
	<Tabs.Content value="rules">
		<Rules />
	</Tabs.Content>
	<Tabs.Content value="matches">
		<PairUps />
	</Tabs.Content>
	<Tabs.Content value="chat">
		{#if !socket}
			<Chat {messages} onSendMessage={sendMessageToSocket} />
		{:else}
			Loading...
		{/if}
	</Tabs.Content>
</Tabs.Root>

<style>
	.countdown {
		font-size: 1.5rem;
		font-weight: bold;
		text-align: center;
		margin: 1rem 0;
		padding: 0.5rem;
		background-color: #f0f0f0;
		border-radius: 8px;
	}
</style>
