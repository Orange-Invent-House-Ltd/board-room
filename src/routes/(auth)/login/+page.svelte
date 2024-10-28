<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
</script>

<div class="flex h-screen flex-col justify-between">
	<div class="mx-auto mb-[200px] mt-[100px] w-fit">
		<Logo />
	</div>

	<div class="mb-6 space-y-5">
		<a
			href="/api/google"
			class="relative inline-block w-full rounded-3xl bg-white py-3 text-center font-semibold capitalize text-black"
		>
			<img src="./google.svg" class="absolute left-5 top-3" alt="" />

			Sign in with google
		</a>
		<button
			class="relative w-full rounded-3xl bg-[#1877F2] py-3 font-semibold capitalize text-white"
		>
			<img src="./facebook.svg" class="absolute left-5 top-3" alt="" />

			Sign in with Facebook
		</button>
		<button
			class="relative w-full rounded-3xl border-2 border-white bg-transparent py-3 font-semibold capitalize text-white"
		>
			<img src="./apple.svg" class="absolute left-5 top-3" alt="" />

			Sign in with Apple
		</button>
	</div>

	<div class="mb-20 text-center">
		<p class="mb-10">By continuing, you agree to the Terms and Privacy Policy.</p>
		<p>Don’t have an account? <span class="text-[#3574F5]">Sign up.</span></p>
	</div>
</div>
