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
		<div class="space-y-4 text-center">
			<img src="/verified.svg" class="mx-auto w-fit" alt="" />
			<p class="font-medium uppercase">invite link</p>
			<p class="text-center">Copy the invite link below and share with your opponent.</p>
			<Input value="ertyvubeg7ui3wg7eui" disabled />
			<Button variant="outline" class="mt-6 w-full rounded-full bg-[#3574F5]">Copy link</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
