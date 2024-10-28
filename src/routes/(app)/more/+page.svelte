<script lang="ts">
	import { FileText, Headphones, Heart, History, LogOut, Settings, Wallet } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let menuItems = [
		{ icon: History, label: 'Game history', color: 'text-white', href: '/more/game-history' },
		{ icon: Settings, label: 'Settings', color: 'text-white', href: '/more/settings' },
		{ icon: Wallet, label: 'My wallet', color: 'text-white', href: '/more/wallet' },
		{ icon: Headphones, label: 'Customer support', color: 'text-white', href: '/more/support' },
		{ icon: Heart, label: 'Write a review', color: 'text-white', href: '/more/reviews' },
		{ icon: FileText, label: 'FAQ', color: 'text-white', href: '/more/faq' },
		{ icon: LogOut, label: 'Logout', color: 'text-red-500' }
	];
</script>

<h1 class="mb-10 text-2xl font-medium">More</h1>
<div>
	{#each menuItems as item}
		<button
			class="flex w-full items-center justify-between border-b border-gray-700 py-6 pl-2 transition-all last:border-b-0 hover:rounded-md hover:bg-gray-900/70"
			onclick={() => {
				if (item.href) goto(item.href);
			}}
		>
			<div class="flex items-center">
				<svelte:component this={item.icon} class={`${item.color} mr-3`} size={20} />
				<span class={item.color}>{item.label}</span>
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
