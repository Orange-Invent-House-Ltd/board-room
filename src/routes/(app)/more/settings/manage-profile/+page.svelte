<script lang="ts">
	import { AtSign, Bell, Facebook, Instagram, Pencil, Twitter, User2 } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let user = $derived(data.user);
	$inspect(user);
	console.log('🚀 ~ data:', data);
	let menuItems = $derived([
		{
			label: 'email',
			subLabel: data.user.email,
			icon: AtSign
		},
		{
			label: 'twitter',
			subLabel: data.user.xHandle,
			icon: Twitter
		},
		{
			label: 'instagram',
			subLabel: data.user.instagramHandle,
			icon: Instagram
		},
		{
			label: 'facebook',
			subLabel: data.user.facebookHandle,
			icon: Facebook
		}
	]);
	console.log('🚀 ~ menuItems:', menuItems);
	let isEditing = $state(false);
	let editingStates = $state(menuItems.map(() => false));

	function toggleEditing(index: number) {
		// Toggle only the specific item's editing state
		editingStates[index] = !editingStates[index];
	}
</script>

<h1 class="mb-10 text-2xl font-medium">Manage Profile</h1>

<div class="mx-auto mb-8 w-fit text-center">
	<Avatar.Root class="mx-auto size-24">
		<Avatar.Image src={data.user.picture} alt="@shadcn" />
		<Avatar.Fallback>{data.user.name}</Avatar.Fallback>
	</Avatar.Root>

	<h2 class="text-3xl font-bold">@{data.user.name}</h2>
</div>
<div>
	{#each menuItems as item, index}
		<div
			class="flex w-full items-center justify-between border-b border-gray-700 py-6 pl-2 transition-all last:border-b-0 hover:rounded-md hover:bg-gray-900/70"
		>
			<div class="flex items-center gap-3">
				<svelte:component this={item.icon} class="mr-3" size={20} />
				<div class=" text-left">
					<div class="text-xs capitalize">{item.label}</div>
					<form
						use:enhance={({ formElement, formData, action, cancel, submitter }) => {
							// `formElement` is this `<form>` element
							// `formData` is its `FormData` object that's about to be submitted
							// `action` is the URL to which the form is posted
							// calling `cancel()` will prevent the submission
							// `submitter` is the `HTMLElement` that caused the form to be submitted

							return async ({ result, update }) => {
								await update();
								toggleEditing(index);
							};
						}}
						method="POST"
						class="font-medium capitalize"
					>
						{#if editingStates[index]}
							<input name="handle" class="bg-background" type="text" />
							<input name="platform" value={item.label} hidden class="bg-background" type="text" />
						{:else if item.subLabel}
							{item.subLabel}
						{:else}
							Not Added Yet
						{/if}
						<button></button>
					</form>
				</div>
			</div>
			{#if item.label !== 'email'}
				<button
					onclick={() => {
						isEditing = !isEditing;
						toggleEditing(index);
					}}
					class="flex size-7 items-center justify-center rounded-full bg-[#F1F1F1] text-black"
				>
					<Pencil class="size-4 text-black" />
				</button>
			{/if}
		</div>
	{/each}
</div>
