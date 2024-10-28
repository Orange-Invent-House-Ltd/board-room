<script lang="ts">
	import { Input } from '$lib/components/ui/input';
</script>

<h1 class="mb-10 text-2xl font-medium">Notification</h1>

<div class="mb-10 space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-base font-medium">Enable notification</h2>
		</div>

		<div class="size-5 bg-blue-500">
			<!-- this is a make shift checkbox -->
		</div>
	</div>
	<div class="flex items-center justify-between">
		<div>
			<h2 class="mb-1 text-base font-medium">Discoverable nearby</h2>
			<p class="text-xs font-light">Enable this feature to find nearby people playing BroadRoom.</p>
		</div>

		<div class="size-5 bg-blue-500">
			<!-- this is a make shift checkbox -->
		</div>
	</div>
	<div class="flex items-center justify-between">
		<div>
			<h2 class="mb-1 text-base font-medium">Tournament mode</h2>
			<p class="text-xs font-light">Get notified when tournaments are about to begin.</p>
		</div>

		<div class="size-5 bg-blue-500">
			<!-- this is a make shift checkbox -->
		</div>
	</div>
</div>

<div>
	<h3 class="mb-4 font-medium text-[#AFAFAF]">Report a foul play</h3>

	<div class="space-y-4">
		<Input />
		<Input />
	</div>
</div>
