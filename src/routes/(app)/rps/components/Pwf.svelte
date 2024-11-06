<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { PwfRpsSchema } from '$lib/formSchema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import InviteDrawer from '$lib/components/Drawers/InviteDrawer.svelte';
	import FundWalletAlert from '$lib/components/FundWalletAlert.svelte';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import { Loader } from 'lucide-svelte';

	let {
		pwfForm
	}: {
		pwfForm: SuperValidated<Infer<typeof PwfRpsSchema>>;
	} = $props();

	const form = superForm(pwfForm, {
		validators: zodClient(PwfRpsSchema)
	});

	const { enhance, delayed, form: formData } = form;
</script>

<div class="mb-10 min-h-screen bg-black text-white">
	<h1 class="mb-6 text-2xl font-medium">Play With Friend</h1>

	<form method="POST" class="space-y-4" use:enhance>
		<Form.Field {form} name="friendEmail">
			<Form.Control let:attrs>
				<Form.Label>Friend's email</Form.Label>
				<Input {...attrs} bind:value={$formData.friendEmail} placeholder="e.g Beast_Mode" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="stakingAmount">
			<Form.Control let:attrs>
				<Form.Label>Staking amount ₦</Form.Label>
				<CurrencyInput
					{...attrs}
					bind:value={$formData.stakingAmount}
					inputClasses={{
						formatted:
							'flex h-[56px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						formattedPositive: '',
						formattedNegative: 'text-red-700'
					}}
					locale="en-NG"
					currency="NGN"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<FundWalletAlert />

		<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
			{#if $delayed}
				<Loader class="size-6 animate-spin" />
			{:else}
				<Form.Button class="w-full rounded-full bg-blue-600 py-3 text-white"
					>Send invite</Form.Button
				>
			{/if}
		</div>
		<InviteDrawer />
	</form>
</div>
