<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { ParticipantWithUser } from '$lib/types';
	type Props = {
		players: ParticipantWithUser[];
	};
	let { players }: Props = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="text-[#C6C6C6]">
			<Table.Head class="w-[100px] text-[#C6C6C6]">Player</Table.Head>
			<Table.Head class="text-[#C6C6C6]">Rating</Table.Head>
			<Table.Head class="text-[#C6C6C6]">Win</Table.Head>
			<Table.Head class="text-[#C6C6C6]">Draw</Table.Head>
			<Table.Head class="text-[#C6C6C6]">Lost</Table.Head>
		</Table.Row>
	</Table.Header>
	{#each players as player}
		<Table.Body>
			<Table.Row>
				<Table.Cell class="flex w-full  items-center gap-1 truncate font-medium">
					<img src={player.user.picture} class="size-10 rounded-full" alt="profile pic" />
					<p class="text-xs font-medium">{player.user.username}</p>
				</Table.Cell>
				<Table.Cell class="text-sm font-medium text-white">{player.points}</Table.Cell>
				<Table.Cell class="text-sm font-medium text-green-500">{player.wins}</Table.Cell>
				<Table.Cell class="text-sm font-medium text-white">{player.draws}</Table.Cell>
				<Table.Cell class="text-sm font-medium text-red-500">{player.losses}</Table.Cell>
			</Table.Row>
		</Table.Body>
	{/each}
</Table.Root>
