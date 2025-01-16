<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Button from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let opponent = $derived(data.opponent);
	let matchId = $derived(data.matchId);

	let timeLeft = $state(30);
	let isReady = $state(false);
	let opponentReady = $state(false); // This should be synced with your backend
	let startCountdown = $state(5);
	let matchTimer: NodeJS.Timeout;
	let gameStartTimer: NodeJS.Timeout;

	$effect(() => {
		initMatchTimer();
		return () => {
			if (matchTimer) clearInterval(matchTimer);
			if (gameStartTimer) clearInterval(gameStartTimer);
		};
	});

	$effect(() => {
		if (isReady && opponentReady) {
			startGameCountdown();
		}
	});

	function startGameCountdown() {
		gameStartTimer = setInterval(() => {
			startCountdown -= 1;
			if (startCountdown <= 0) {
				clearInterval(gameStartTimer);
				goto('../game');
			}
		}, 1000);
	}

	function initMatchTimer() {
		matchTimer = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				clearInterval(matchTimer);
				handleTimeout();
			}
		}, 1000);
	}

	function handleTimeout() {
		if (!isReady) {
			handleAbort();
		}
	}

	function handleReady() {
		isReady = true;
		// Add your ready logic here and sync with backend
	}

	function handleAbort() {
		if (matchTimer) clearInterval(matchTimer);
		if (gameStartTimer) clearInterval(gameStartTimer);
		// goto('../lobby');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
	<div class="max-w-md w-full space-y-8 p-6">
		<div class="text-center space-y-4">
			<div class="flex justify-center items-center gap-2">
				<h1 class="text-3xl font-bold tracking-tight">Your Opponent</h1>
				<div class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xl font-mono">
					{timeLeft}s
				</div>
			</div>
			<p class="text-muted-foreground">Get ready for the match!</p>
		</div>

		<div class="flex flex-col items-center space-y-6 py-8">
			<div class="relative">
				<Avatar.Root class="w-32 h-32">
					<Avatar.Image
						src={opponent.user.picture ?? ''}
						alt={opponent.user.username}
						class="object-cover"
					/>
					<Avatar.Fallback class="text-2xl"
						>{opponent.user.username.slice(0, 2).toUpperCase()}</Avatar.Fallback
					>
				</Avatar.Root>
				<div
					class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium"
				>
					{opponent.points ?? 1500}
				</div>
				{#if opponentReady}
					<div
						class="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
					>
						✓
						{#if isReady && opponentReady}
							<div
								class="absolute -top-3 -right-3 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-mono"
							>
								{startCountdown}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="text-center space-y-2">
				<h2 class="text-2xl font-semibold">{opponent.user.username}</h2>
				<div class="flex items-center justify-center gap-2">
					<p class="text-muted-foreground">Rating: {opponent.points ?? 1500}</p>
					<div
						class="text-sm px-2 py-0.5 rounded-full {opponentReady
							? 'bg-green-500/10 text-green-500'
							: 'bg-muted text-muted-foreground'}"
					>
						{opponentReady ? 'Ready' : 'Not Ready'}
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 items-center pt-4">
			<div class="flex gap-4 justify-center w-full">
				<form action="?/abort" method="POST" use:enhance>
					<input type="hidden" name="matchId" value={matchId} />
					<Button.Root variant="destructive" type="submit" class="w-32" disabled={isReady}>
						Abort
					</Button.Root>
				</form>
				<form action="?/ready" method="POST" use:enhance>
					<input type="hidden" name="matchId" value={matchId} />
					<Button.Root variant="default" type="submit" class="w-32" disabled={isReady}>
						{#if isReady}
							Ready ✓
						{:else}
							I'm Ready
						{/if}
					</Button.Root>
				</form>
			</div>
			{#if isReady}
				<p class="text-muted-foreground">
					{opponentReady ? 'Both players ready! Starting game...' : 'Waiting for opponent...'}
				</p>
			{/if}
		</div>
	</div>
</div>
