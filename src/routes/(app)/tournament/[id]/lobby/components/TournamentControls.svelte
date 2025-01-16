<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import type { Tournament } from '$lib/types';

	export let tournament: Tournament;
	export let isOwner: boolean;

	$: canStartRound =
		tournament.status === 'LIVE' &&
		tournament.currentRound === 0 &&
		tournament.currentRound < tournament.numberOfRounds;
	$: canEndRound = tournament.status === 'LIVE' && tournament.currentRound > 0;
</script>

{#if isOwner}
	<div class="space-y-4">
		<div class="flex items-center justify-between p-4 bg-card rounded-lg shadow">
			<div>
				<h3 class="text-lg font-semibold">Tournament Controls</h3>
				<p class="text-sm text-muted-foreground">
					Round {tournament.currentRound} of {tournament.numberOfRounds}
				</p>
			</div>
			<div class="space-x-2">
				<form method="POST" action="?/startRound" use:enhance>
					<Button type="submit" disabled={!canStartRound}>Start Round</Button>
				</form>

				<form method="POST" action="?/endRound" use:enhance>
					<Button type="submit" disabled={!canEndRound}>End Round</Button>
				</form>
			</div>
		</div>

		{#if tournament.status === 'LIVE' && tournament.currentRound > 0}
			<div class="p-4 bg-card rounded-lg shadow">
				<h3 class="text-lg font-semibold mb-2">Current Round Status</h3>
				<p class="text-sm text-muted-foreground">
					Round {tournament.currentRound} is in progress. All matches must be completed before ending
					the round.
				</p>
			</div>
		{/if}
	</div>
{/if}
