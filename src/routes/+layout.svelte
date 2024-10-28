<script lang="ts">
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
</script>

<div class=" mx-auto max-w-md">
	<main class=" h-full min-h-svh">
		<slot></slot>
	</main>
	{#if !['/login', '/chess', '/uno', '/rps', '/checkers'].some( (path) => $page.url.pathname.startsWith(path) )}
		<Footer />
	{/if}
</div>
