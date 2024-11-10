<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';
	type Props = {
		code: string;
		open: boolean;
	};
	let { code, open }: Props = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Content class=" mx-auto max-w-md border-none bg-[#2E2E30] p-6 text-white">
		<div class="flex justify-end">
			<Drawer.Close class="text-gray-400 hover:text-white">
				<X size={24} />
			</Drawer.Close>
		</div>
		<div class="space-y-4 text-center">
			<img src="/verified.svg" class="mx-auto w-fit" alt="" />
			<p class="font-medium uppercase">invite link</p>
			<p class="text-center">Copy the invite link below and share with your opponent</p>
			<Input value={code} disabled />
			<Button
				variant="outline"
				onclick={() => {
					navigator.clipboard.writeText(code);
					open = false;
				}}
				class="mt-6 w-full rounded-full bg-[#3574F5]">Copy link</Button
			>
		</div>
	</Drawer.Content>
</Drawer.Root>
