<script lang="ts">
	import { Trophy } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { formatNaira } from '$lib/utils';

	type Props = {
		tournamentName: string;
		tournamentFee: number;
		gameMode: string;
		format: string;
		startsIn: string;
		gameType: string;
		currentPlayers: number;
		maxPlayers: number;
	};

	let {
		tournamentName,
		tournamentFee,
		gameMode,
		format,
		startsIn,
		gameType,
		currentPlayers,
		maxPlayers
	}: Props = $props();
</script>

<h1 class="mb-4 text-center text-2xl font-bold capitalize">{tournamentName}</h1>
<div class="mx-auto h-full min-h-[110px] w-full max-w-[354px] rounded-xl bg-blue-500 py-5">
	<div class="mx-auto w-fit text-center">
		<Trophy class="mx-auto" />
		<Badge class="my-2">Badge</Badge>
		<h1 class="text-2xl font-bold">{formatNaira(tournamentFee)}</h1>
	</div>
</div>

<div class="mt-6 rounded-lg bg-black py-6 font-sans text-white">
	<h2 class="mb-6 font-medium">Tournament Info</h2>

	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<span class="text-sm">Format</span>
			<span class="text-sm font-semibold">swiss system</span>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-sm">Tournament starts in</span>
			<span class="text-sm font-semibold">{startsIn}</span>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-sm">Game Type</span>
			<span class="text-sm font-semibold">{gameType}</span>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-sm">Game Members</span>
			<span class="text-sm font-semibold">{currentPlayers} / {maxPlayers} players</span>
		</div>
	</div>
</div>
