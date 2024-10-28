<script lang="ts">
</script>

<h1 class="mb-10 text-2xl font-medium">Select Players</h1>

<p class="mb-4 font-medium capitalize">Select Number of Players</p>

<div class="w-full space-y-4">
	{#each { length: 3 } as _, i}
		<a
			href="how-to-play"
			class=" flex w-full gap-5 rounded-lg border border-[#6D6D6E] px-6 py-5 text-left"
		>
			<img src="/number{i + 2}.svg" alt="" />
			<div class="">
				<h2 class="text-sm font-semibold">{i + 2} Players</h2>
				<p class="text-xs text-[#6D6D6E]">Lorem ipsum dolor sit amet consectetur.</p>
			</div>
		</a>
	{/each}
</div>
