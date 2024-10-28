<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<h1 class="mb-10 text-2xl font-medium">Wallet</h1>

<div class="mb-6 text-center">
	<p class="capitalize text-[#C6C6C6]">Total Balance</p>
	<p class="text-2xl font-bold">0.00</p>
</div>

<div class="flex items-center justify-between gap-5">
	<Button class="w-full  rounded-full border border-white bg-black">Withdraw</Button>
	<Button class="w-full rounded-full border border-white bg-blue-600 py-3 text-white"
		>Fund Wallet</Button
	>
</div>
