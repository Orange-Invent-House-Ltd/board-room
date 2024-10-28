<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
</script>

<h1 class="mb-6 text-2xl font-medium">Daily Challenge</h1>
<h2 class="mb-6 font-medium">Current Leaderboard</h2>

<div class="">
	<Table.Root>
		<Table.Header>
			<Table.Row class="text-nowrap text-sm font-medium">
				<Table.Head class=" text-[#C6C6C6]">Rank</Table.Head>
				<Table.Head class="text-[#C6C6C6]">Player</Table.Head>
				<Table.Head class="w-fit text-[#C6C6C6]">Time</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each { length: 5 } as _, i}
				<Table.Row class="text-nowrap  text-xs text-[#ffffff]">
					<Table.Cell class=" font-semibold ">{i + 1}</Table.Cell>
					<Table.Cell class="flex w-full  items-center gap-1 truncate font-medium">
						<img src="/avatar.png" class="size-10 rounded-full" alt="" />
						<p class="text-xs font-medium">@Grand_Maestro</p>
					</Table.Cell>
					<Table.Cell class="w-fit">03:23</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<div class="fixed bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button class="w-full rounded-full bg-blue-600 py-3 text-white">Play Now</Button>
	</div>
</div>
