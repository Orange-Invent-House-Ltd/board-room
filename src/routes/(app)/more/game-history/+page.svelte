<script lang="ts">
	import {
		FileText,
		Headphones,
		Heart,
		History,
		LogOut,
		Search,
		Settings,
		Wallet
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';

	export let data: PageData;
</script>

<h1 class="mb-10 text-2xl font-medium">Game History</h1>

<Tabs.Root value="tournaments">
	<Tabs.List>
		<Tabs.Trigger value="tournaments">Tournaments</Tabs.Trigger>
		<Tabs.Trigger value="scheduled">Scheduled games</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="tournaments">
		<div class="my-5 flex w-full items-center gap-2 rounded-2xl border border-[#AFAFAF] py-3">
			<Search class="ml-4 size-4 text-[#AFAFAF] " />
			<input
				type="text"
				class="w-full flex-1 border-none bg-transparent outline-none"
				name=""
				id=""
				placeholder="Search"
			/>
		</div>
		<div class="space-y-4">
			{#each { length: 5 } as _}
				<a
					href="/tournament/tournament-history"
					class="block rounded-md border border-[#AFAFAF] p-4"
				>
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
				</a>
			{/each}
		</div>
	</Tabs.Content>
	<Tabs.Content value="scheduled">Change your password here.</Tabs.Content>
</Tabs.Root>
