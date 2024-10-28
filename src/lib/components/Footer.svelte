<script lang="ts">
	import { page } from '$app/stores';
	import Explore from '$lib/assets/Explore.svelte';
	import Home from '$lib/assets/Home.svelte';
	import More from '$lib/assets/More.svelte';
	import Tournament from '$lib/assets/Tournament.svelte';
	import { cn } from '$lib/utils';

	const items = [
		{ name: 'home', icon: Home, href: '/' },
		{ name: 'explore', icon: Explore, href: '/explore' },
		{ name: 'tournament', icon: Tournament, href: '/tournament' },
		{ name: 'more', icon: More, href: '/more' }
	];
	let activeLink = $derived($page.url.pathname);
</script>

<div class="sticky bottom-0 flex items-center gap-5 bg-background px-5">
	{#each items as item}
		<a
			href={item.href}
			class={cn('flex w-full max-w-28 flex-col items-center  py-2.5 text-center', {
				'border-t-2 border-[#3574F5] text-[#3574F5]': activeLink === item.href
			})}
		>
			<svelte:component this={item.icon} />
			<p class="text-xs capitalize text-inherit">{item.name}</p>
		</a>
	{/each}
</div>
