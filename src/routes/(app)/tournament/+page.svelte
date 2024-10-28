<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Filter } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let data: PageData;
</script>

<div class="flex items-center justify-between gap-5">
	<h1 class=" text-2xl font-medium">Tournaments</h1>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger><Filter /></DropdownMenu.Trigger>
		<DropdownMenu.Content class="bg-[#2E2E30] text-white ">
			<DropdownMenu.Group>
				<DropdownMenu.Item>Created by me</DropdownMenu.Item>

				<DropdownMenu.Item>Number of players</DropdownMenu.Item>
				<DropdownMenu.Item>By price</DropdownMenu.Item>
				<DropdownMenu.Item>By location</DropdownMenu.Item>
				<DropdownMenu.Item>By type</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
<div
	class="my-6 flex w-full items-center justify-between rounded-3xl bg-[#2E2E30] px-4 py-3 text-sm"
>
	<p class="h-fit w-fit rounded-2xl bg-blue-600 px-2 py-1 text-white">All</p>
	<p class="h-fit w-fit rounded-2xl px-2 py-1 text-white">Chess</p>
	<p class="h-fit w-fit rounded-2xl px-2 py-1 text-white">Uno</p>
	<p class="h-fit w-fit rounded-2xl px-2 py-1 text-white">Ludo</p>
	<p class="h-fit w-fit rounded-2xl px-2 py-1 text-white">Rps</p>
	<p class="h-fit w-fit rounded-2xl px-2 py-1 text-white">Checkers</p>
</div>

<div class="space-y-4">
	{#each { length: 5 } as _}
		<div class="rounded-md border border-[#AFAFAF] p-4">
			<div class="mb-2 flex justify-between text-sm font-medium">
				<p>Blitz</p>
				<p>(#)25,000</p>
			</div>
			<p class="mb-2 flex items-center gap-5 text-xs text-[#AFAFAF]">
				<img src="/people.svg" alt="" />
				<span class="font-medium">2</span>
			</p>
			<p class="mb-2 flex items-center gap-5 text-xs text-[#AFAFAF]">
				<img src="/clock.svg" alt="" />
				<span class="font-medium">5 hours</span>
			</p>
			<div class="mb-2 flex items-center justify-between text-xs text-[#AFAFAF]">
				<p class="flex items-center gap-5">
					<img src="/lock.svg" alt="" />
					<span class="font-medium">Public</span>
				</p>
				<p>% users joined</p>
			</div>
		</div>
	{/each}
</div>
