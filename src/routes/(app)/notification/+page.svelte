<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	let { data } = $props();
</script>

<h1 class=" text-2xl font-medium">Notifications</h1>

{#if data.notifications.length === 0}
	<div class="text-center mt-[100px]">
		<img src="/notification.svg" class="mx-auto mb-4 w-fit" alt="" />
		<p class="mb-1 text-base font-medium">You don’t have any notifications right <br /> now!</p>
		<p class="text-xs font-normal">
			We will notify you as soon as we have something to share with you.
		</p>
	</div>
{:else}
	<h2 class="text-2xl mb-3 mt-6 font-medium">Today</h2>
	{#each data.notifications as notification}
		<a
			href={`rps/room/${notification.inviteCode}`}
			class="flex items-center py-3 mb-4 border-b border-[#E4E4E44D] gap-3"
		>
			<Avatar.Root class="size-9">
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>

			<div>
				<div>
					<span class="font-medium">{notification.sender?.username}</span>
					<span class="text-[12px]"> {notification.message} </span>
				</div>
				<p class="text-[10px] text-[#F1F1F1]">{notification.updatedAt}</p>
			</div>
		</a>
	{/each}
{/if}
