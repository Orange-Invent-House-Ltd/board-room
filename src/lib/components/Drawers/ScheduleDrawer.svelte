<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';
</script>

<Drawer.Root>
	<Drawer.Trigger>
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	</Drawer.Trigger>
	<Drawer.Content class=" mx-auto max-w-md border-none bg-[#2E2E30] p-6 text-white">
		<div class="flex justify-end">
			<Drawer.Close class="text-gray-400 hover:text-white">
				<X size={24} />
			</Drawer.Close>
		</div>
		<div class="space-y-6 text-center">
			<img src="/verified.svg" class="mx-auto w-fit" alt="" />
			<p class="font-medium uppercase">SCHEDULE SUCCESSFUL</p>
			<p class="text-center">
				Your game against [opponent’s username] has been scheduled successfully.
			</p>
			<div class="flex items-center justify-center gap-3">
				<p>you</p>
				<img src="/vs.svg" alt="" />
				<p>[opponent’s username]</p>
			</div>
			<div class="space-y-5">
				<div class="flex items-center justify-between">
					<p>variant</p>
					<p>Blitz</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Minute per side</p>
					<p>10 minutes</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Date</p>
					<p>28/09/2024</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Time</p>
					<p>12:00pm</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Staking amount</p>
					<p>5,000</p>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
