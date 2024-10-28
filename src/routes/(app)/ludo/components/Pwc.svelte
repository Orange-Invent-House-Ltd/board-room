<script lang="ts">
	let colors = ['#3574F5', '#E93223', '#285614', '#F7DF4B'];
</script>

<h1 class="mb-10 text-2xl font-medium">Play With Computer</h1>

<p class="mb-4 font-medium capitalize">Choose Your Color</p>

<div class=" mx-auto grid w-full grid-cols-2 gap-5">
	{#each colors as color}
		<button class="relative h-fit w-full rounded-md active:border-4 active:border-blue-400">
			<div class="h-[170px] w-full rounded-md" style="background-color:{color}"></div>
			<div class="absolute left-[16px] top-[16px] size-[24px] rounded-full border-2 bg-white"></div>
		</button>
	{/each}
</div>
