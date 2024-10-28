<script lang="ts">
	import { goto } from '$app/navigation';
	import { Bell, User2 } from 'lucide-svelte';

	let menuItems = [
		{
			label: 'Mange profile',
			icon: User2,
			href: '/more/settings/manage-profile'
		},
		{
			label: 'Notifications',
			icon: Bell,
			href: '/more/settings/notification'
		}
	];
</script>

<h1 class="mb-10 text-2xl font-medium">Settings</h1>

<div>
	{#each menuItems as item}
		<button
			class="flex w-full items-center justify-between border-b border-gray-700 py-6 pl-2 transition-all last:border-b-0 hover:rounded-md hover:bg-gray-900/70"
			onclick={() => {
				goto(item.href);
			}}
		>
			<div class="flex items-center">
				<svelte:component this={item.icon} class="mr-3" size={20} />
				<span>{item.label}</span>
			</div>
			<svg
				class="h-4 w-4 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
		</button>
	{/each}
</div>
