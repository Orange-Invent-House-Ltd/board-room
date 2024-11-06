<script lang="ts">
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	import NProgress from 'nprogress';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	NProgress.configure({
		showSpinner: false
	});

	beforeNavigate(() => {
		NProgress.start();
	});
	afterNavigate(() => {
		NProgress.done();
	});
	afterNavigate;

	let { children } = $props();
</script>

<div class=" mx-auto max-w-md">
	<main class=" h-full min-h-svh">
		{@render children()}
	</main>
	{#if !['/login', '/chess', '/uno', '/rps', '/checkers'].some( (path) => $page.url.pathname.startsWith(path) )}
		<Footer />
	{/if}
</div>
