<script>
	export let pieceCount;
	export let gameOver;
</script>

<div class="scoreboard">
	<h2>Scoreboard</h2>
	<div class="scores">
		<div class="score-item">
			<div class="piece-indicator red"></div>
			<span class="player">Red</span>
			<span class="count">{pieceCount.red}</span>
		</div>
		<div class="score-item">
			<div class="piece-indicator black"></div>
			<span class="player">Black</span>
			<span class="count">{pieceCount.black}</span>
		</div>
	</div>
	{#if gameOver}
		<div class="winner">
			<div class="trophy">🏆</div>
			<div class="winner-text">
				<span class="winner-label">Winner</span>
				<span
					class="winner-name"
					class:red={pieceCount.red > pieceCount.black}
					class:black={pieceCount.red < pieceCount.black}
				>
					{pieceCount.red > pieceCount.black ? 'Red' : 'Black'}
				</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.scoreboard {
		padding: 1rem;
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius);
		width: 100%;
		max-width: 320px;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	h2 {
		margin: 0 0 1rem 0;
		text-align: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: hsl(var(--foreground));
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.scores {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.score-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: hsl(var(--muted) / 0.7);
		border: 1px solid hsl(var(--border));
		border-radius: calc(var(--radius) * 0.75);
		transition: all 0.2s;
	}

	.score-item:hover {
		background: hsl(var(--muted));
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.piece-indicator {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.2),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
		flex-shrink: 0;
	}

	.piece-indicator.red {
		background: linear-gradient(135deg, #ff5555 0%, #cc0000 100%);
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.piece-indicator.black {
		background: linear-gradient(135deg, #444444 0%, #111111 100%);
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.player {
		flex-grow: 1;
		font-weight: 600;
		font-size: 1rem;
		color: hsl(var(--foreground));
	}

	.count {
		font-size: 1.25rem;
		font-weight: 700;
		color: hsl(var(--foreground));
		min-width: 2rem;
		text-align: right;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.winner {
		margin-top: 1.25rem;
		padding: 1rem;
		background: linear-gradient(
			135deg,
			hsl(var(--primary) / 0.15) 0%,
			hsl(var(--primary) / 0.25) 100%
		);
		border: 1px solid hsl(var(--primary) / 0.2);
		border-radius: var(--radius);
		text-align: center;
		animation: winner-glow 2s ease-in-out infinite;
	}

	.trophy {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		animation: trophy-bounce 1s ease-in-out infinite;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.winner-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.winner-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 500;
		color: hsl(var(--foreground) / 0.8);
	}

	.winner-name {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.02em;
	}

	.winner-name.red {
		color: #ff5555;
		text-shadow: 0 0 15px rgba(255, 85, 85, 0.4);
	}

	.winner-name.black {
		color: #444444;
		text-shadow: 0 0 15px rgba(68, 68, 68, 0.4);
	}

	@keyframes winner-glow {
		0%,
		100% {
			box-shadow: 0 0 15px hsl(var(--primary) / 0.3);
		}
		50% {
			box-shadow: 0 0 25px hsl(var(--primary) / 0.5);
		}
	}

	@keyframes trophy-bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}

	@media (max-width: 640px) {
		.scoreboard {
			padding: 0.75rem;
			max-width: none;
		}

		h2 {
			font-size: 1.125rem;
			margin-bottom: 0.75rem;
		}

		.score-item {
			padding: 0.5rem 0.75rem;
		}

		.piece-indicator {
			width: 20px;
			height: 20px;
		}

		.player {
			font-size: 0.875rem;
		}

		.count {
			font-size: 1.125rem;
		}

		.winner {
			margin-top: 1rem;
			padding: 0.75rem;
		}

		.trophy {
			font-size: 2rem;
			margin-bottom: 0.375rem;
		}

		.winner-name {
			font-size: 1.25rem;
		}
	}
</style>
