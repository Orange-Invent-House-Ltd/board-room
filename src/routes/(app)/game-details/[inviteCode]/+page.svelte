<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { X } from 'lucide-svelte';

	let { data, form } = $props();
	let openDrawer = $state(false);
</script>

<div class="">
	<h1 class="text-2xl font-medium mb-6">Game Details</h1>
	<img src="/verified.svg" class="mx-auto w-fit" alt="" />
	<h2 class="font-medium uppercase text-center mt-2 mb-6">{data.gameInvitation.gameName}</h2>
	<div class="max-w-[307px] w-full mx-auto space-y-3">
		<div class="flex capitalize items-center justify-between">
			<p class="font-light">game type</p>
			<p>{data.gameInvitation.gameName}</p>
		</div>

		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Game status</p>
			<p>{data.gameInvitation.status}</p>
		</div>

		{#if data.gameInvitation.stakingAmount}
			<div class="flex items-center capitalize justify-between">
				<p class="font-light">Staking Amount</p>
				<p>{data.gameInvitation.stakingAmount}</p>
			</div>
		{/if}
		<div class="flex items-center capitalize justify-between">
			<p class="font-light">Created by</p>
			<p>{data.gameInvitation.initiator.username}</p>
		</div>
		<form
			method="POST"
			use:enhance={({ formData }) => {
				formData.append('inviteCode', String(data.gameInvitation.inviteCode));
				return async ({ update, result }) => {
					await update();
					if (result.type === 'failure') {
						openDrawer = true;
					}
				};
			}}
			class="grid grid-cols-2 pt-10 items-center gap-3"
		>
			<Button formaction="?/declineInvite" type="submit" variant="ghost">Reject invite</Button>
			<Button formaction="?/acceptInvite" type="submit">Accept invite</Button>
		</form>
	</div>
</div>

<Drawer.Root bind:open={openDrawer}>
	<Drawer.Content class=" mx-auto max-w-md border-none bg-[#2E2E30] p-6 text-white">
		<div class="flex justify-end">
			<Drawer.Close class="text-gray-400 hover:text-white">
				<X size={24} />
			</Drawer.Close>
		</div>
		<div class="space-y-6 text-center">
			<img src="/verified.svg" class="mx-auto w-fit" alt="" />
			<p class="font-medium uppercase">WARNING</p>

			{#if form}
				<p class="text-center">
					{form.message}
				</p>
			{/if}
			<div class="flex items-center justify-center gap-3">
				<p>you</p>
				<img src="/vs.svg" alt="" />
				<p>[opponent’s username]</p>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
