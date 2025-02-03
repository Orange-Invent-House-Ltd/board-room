<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_WORKERS_URL } from '$env/static/public';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { Message, TournamentMessage } from '$lib/types';
	import Chat from './components/Chat.svelte';
	import Overview from './components/Overview.svelte';
	import PairUps from './components/PairUps.svelte';
	import Players from './components/Players.svelte';
	import Rules from './components/Rules.svelte';
	import Timer from './components/Timer.svelte';
	import { toast } from 'svelte-sonner';
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
		playerId = $page.data.userWithStats.id;
		socket = new WebSocket(`ws://${PUBLIC_WORKERS_URL}/tournament/${data.tournament.id}/connect`);

		socket.onopen = () => {
			console.log('WebSocket connected');
			console.log(
				'WebSocket connection established, about to send the joinTournament type with payload'
			);
			// Send a message to the server indicating the player has joined
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
					console.log('🚀 ~ $effect ~ data.payload.username:', data.payload.username);
					toast.success(`${data.payload.username} Joined tournament`);
					break;
				case 'TOURNAMENT_START':
					console.log('Tournament started');
					if (!data.payload.tournamentId) {
						console.error('Missing tournament ID in payload', data.payload);
						toast.error('Error starting tournament');
						return;
					}
					console.log('🚀 ~ $effect ~ data.payload.matches:', data.payload);
					// Find the player's match
					const playerMatch = data.payload.matches.find(
						(match) => match.player1Id === playerId || match.player2Id === playerId
					);

					if (!playerMatch) {
						console.error('No match found for player');
						toast.error('Error finding your match');
						return;
					}

					toast.success(`tournament ready`);
					try {
						goto(`/tournament/${data.payload.tournamentId}/match-intro`);
					} catch (error) {
						console.error('Error navigating to match intro:', error);
						toast.error('Error joining match');
					}
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
