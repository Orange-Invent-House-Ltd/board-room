<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { Message } from '$lib/types';

	type Props = {
		messages: Message[];
		onSendMessage: (message: { playerId: number; content: string; username: string }) => void;
	};
	let { messages, onSendMessage }: Props = $props();
	let newMessage = $state('');

	// Auto scroll to bottom when new messages arrive
	$effect(() => {
		const chatContainer = document.getElementById('chat-container');
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	let playerId = $page.data.userWithStats.id;

	function sendMessage(e: SubmitEvent) {
		e.preventDefault();
		if (newMessage.trim()) {
			const message = {
				playerId,
				content: newMessage,
				username: $page.data.userWithStats.username
			};

			onSendMessage(message);

			newMessage = ''; // Clear input after sending
		}
	}
</script>

<div class="flex flex-col h-[600px] bg-background rounded-lg">
	<div class="p-4 border-b">
		<h3 class="font-semibold">Tournament Chat</h3>
	</div>

	<div id="chat-container" class="flex-1 p-4 overflow-y-auto">
		<div class="space-y-4">
			{#each messages as message (message.id)}
				<div
					class="flex items-start gap-2.5 {message.isMine ? 'justify-end' : 'justify-start'}"
					in:fly={{ y: 50, duration: 200 }}
					out:fly={{ y: -50, duration: 200 }}
				>
					<div class="flex flex-col gap-1">
						{#if !message.isMine}
							<p class="text-sm font-semibold text-foreground/80">{message.username}</p>
						{/if}
						<div
							class="max-w-[320px] rounded-lg p-3 {message.isMine
								? 'bg-primary text-primary-foreground ml-auto'
								: 'bg-muted-foreground'}"
						>
							<p class="text-sm">{message.text}</p>
						</div>
						<span class="text-xs text-muted-foreground"
							>{new Date(message.timestamp).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="p-4 border-t">
		<form class="flex gap-2" onsubmit={sendMessage}>
			<Input type="text" placeholder="Type a message..." bind:value={newMessage} class="flex-1" />
			<Button type="submit" disabled={!newMessage.trim()}>Send</Button>
		</form>
	</div>
</div>

<style>
	/* Add smooth scrolling */
	:global(.scroll-area-viewport) {
		scroll-behavior: smooth;
	}
</style>
