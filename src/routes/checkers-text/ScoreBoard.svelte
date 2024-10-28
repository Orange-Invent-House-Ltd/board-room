<script>
	export let pieceCount;
	export let gameOver;
</script>

<div class="scoreboard">
	<h2>Scoreboard</h2>
	<div class="scores">
		<p>Red: {pieceCount.red}</p>
		<p>Black: {pieceCount.black}</p>
	</div>
	{#if gameOver}
		<div class="winner">
			{pieceCount.red > pieceCount.black ? 'Red' : 'Black'} Wins!
		</div>
	{/if}
</div>

<style>
	.scoreboard {
		padding: 20px;
		background-color: #f5f5f5;
		border-radius: 8px;
		min-width: 200px;
	}

	h2 {
		margin-top: 0;
		text-align: center;
	}

	.scores {
		font-size: 18px;
	}

	.winner {
		margin-top: 20px;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		color: #d00;
	}
</style>
