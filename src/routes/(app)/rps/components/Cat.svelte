<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { CatRpsSchema } from '$lib/formSchema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import FundWalletAlert from '$lib/components/FundWalletAlert.svelte';
	import TournamentDrawer from '$lib/components/Drawers/TournamentDrawer.svelte';
	import { Loader2 } from 'lucide-svelte';
	import type { Tournament } from '$lib/types';
	import { TOURNAMENT_TYPE } from '$lib/constants';
	import * as Select from '$lib/components/ui/select';
	import { formatNaira } from '$lib/utils';
	import CurrencyInput from '@canutin/svelte-currency-input';
	let {
		catForm
	}: {
		catForm: SuperValidated<Infer<typeof CatRpsSchema>>;
	} = $props();

	let openDrawer = $state(false);
	let tournamentInformation: Tournament | null = $state(null);
	const form = superForm(catForm, {
		validators: zodClient(CatRpsSchema),
		onUpdated: async ({ form }) => {
			const { message } = form;
			if (message) {
				openDrawer = true;
				tournamentInformation = message as unknown as Tournament;
			}
		}
	});

	const { enhance, delayed, form: formData } = form;
	const formatCurrency = (value) => {
		// Use Intl.NumberFormat to format the value as currency
		return value.toLocaleString('en-US', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	};
	const handleChange = (event) => {
		// Remove the currency formatting and dispatch the change event
		const unformattedValue = parseFloat(event.target.value.replace(/[^0-9.-]+/g, ''));
		$formData.fee = formatCurrency(unformattedValue);
	};
</script>

<h1 class="mb-10 text-2xl font-medium">Create a Tournament</h1>

<form method="POST" action="/rps/create-tournament/?/cat" use:enhance class="relative w-full">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Tournament name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>
			Kindly pick a safe name for your tournament. An inappropriate name could get your account
			permanently closed.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="type">
		<Form.Control let:attrs>
			<Form.Label>Tournament type</Form.Label>
			<Select.Root type="single" bind:value={$formData.type} name={attrs.name}>
				<Select.Trigger {...attrs}>
					{$formData.type ?? 'Select a verified email to display'}
				</Select.Trigger>
				<Select.Content>
					{#each TOURNAMENT_TYPE as type, i}
						<Select.Item value={type} label={type} />
					{/each}
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="maximumPlayers">
		<Form.Control let:attrs>
			<Form.Label>Maximum number of players</Form.Label>
			<Input {...attrs} type="number" bind:value={$formData.maximumPlayers} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="duration">
		<Form.Control let:attrs>
			<Form.Label>Tournament duration</Form.Label>
			<Input {...attrs} type="number" bind:value={$formData.duration} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="numberOfRounds">
		<Form.Control let:attrs>
			<Form.Label>Number of rounds</Form.Label>
			<Input {...attrs} type="number" bind:value={$formData.numberOfRounds} />
		</Form.Control>
		<Form.Description>NOTE: Rounds must be an odd number e.g 1,3,5,7</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="fee">
		<Form.Control let:attrs>
			<Form.Label>Tournament fee</Form.Label>
			{$formData.fee}
			<CurrencyInput
				{...attrs}
				bind:value={$formData.fee}
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
		<Form.Description>Private tournaments are not free. A fee is compulsory.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<FundWalletAlert />
	<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button type="submit" class="w-full rounded-full bg-blue-600 py-3 text-white">
			{#if $delayed}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				Create tournament
			{/if}
		</Button>
	</div>
	<TournamentDrawer {...tournamentInformation} bind:open={openDrawer} />
</form>
