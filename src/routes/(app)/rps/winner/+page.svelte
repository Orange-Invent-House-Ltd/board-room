<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	// Static data for tournament winner demonstration
	const winnerData = {
		name: '@AdebolaFV5PV',
		tournamentPoints: 3,
		matches: 1,
		opponents: [{ name: '@adebolaB4StE', points: 0, position: 2 }],
		winningMove: 'rock',
		losingMove: 'scissors'
	};
</script>

<div class="min-h-screen bg-black p-6">
	<div class="max-w-md mx-auto space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold mb-2 text-white">Tournament Winner!</h1>
			<p class="text-[#AFAFAF]">Tournament completed</p>
		</div>

		<div class="bg-[#2E2E30] rounded-lg shadow-lg p-6 border border-gray-700">
			<div class="text-center">
				<div
					class="size-24 rounded-full bg-[#3574F5]/20 text-white flex items-center justify-center mx-auto mb-4 border-2 border-[#3574F5]/30"
				>
					<span class="text-4xl">🏆</span>
				</div>

				<h2 class="text-2xl font-bold mb-1 text-white">{winnerData.name}</h2>
				<p class="text-[#AFAFAF] mb-3">Tournament Champion</p>

				<div class="flex justify-center items-center gap-3 mb-6">
					<div class="px-4 py-2 bg-[#3574F5]/10 rounded-lg border border-[#3574F5]/30">
						<div class="text-2xl font-bold text-white">{winnerData.tournamentPoints}</div>
						<div class="text-xs text-[#AFAFAF] font-semibold">POINTS</div>
					</div>

					<div class="px-4 py-2 bg-[#3574F5]/10 rounded-lg border border-[#3574F5]/30">
						<div class="text-2xl font-bold text-white">{winnerData.matches}</div>
						<div class="text-xs text-[#AFAFAF] font-semibold">MATCHES</div>
					</div>
				</div>
			</div>

			<div class="border-t border-gray-700 pt-4 mt-4">
				<h3 class="text-sm font-semibold mb-3 uppercase text-[#AFAFAF]">Tournament Standings</h3>

				<div class="space-y-3">
					<!-- Winner row -->
					<div class="flex items-center bg-[#3574F5]/20 p-3 rounded-lg border border-[#3574F5]/30">
						<div
							class="bg-[#3574F5] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
						>
							1
						</div>
						<div class="ml-3 flex-1 font-medium text-white">{winnerData.name}</div>
						<div class="font-bold text-white">{winnerData.tournamentPoints} pts</div>
					</div>

					<!-- Other opponents -->
					{#each winnerData.opponents as opponent}
						<div
							class="flex items-center p-3 rounded-lg bg-black border border-gray-700 hover:bg-[#3574F5]/10"
						>
							<div
								class="bg-[#6D6D6E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
							>
								{opponent.position}
							</div>
							<div class="ml-3 flex-1 font-medium text-white">{opponent.name}</div>
							<div class="font-bold text-white">{opponent.points} pts</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
			<Button
				type="submit"
				class="w-full rounded-full bg-[#3574F5] hover:bg-[#3574F5]/80 py-3 text-white font-medium"
				href="/rps/create-tournament"
			>
				New Tournament
			</Button>
		</div>
	</div>
</div>
