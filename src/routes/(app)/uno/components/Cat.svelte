<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import FundWalletAlert from '$lib/components/FundWalletAlert.svelte';
	import TournamentDrawer from '$lib/components/Drawers/TournamentDrawer.svelte';
	import { createTournamentSchema } from './schema';

	type Prop = {
		catForm: SuperValidated<Infer<typeof createTournamentSchema>>;
	};
	let { catForm }: Prop = $props();

	const form = superForm(catForm, {
		validators: zodClient(createTournamentSchema)
	});

	const { enhance, delayed, form: formData } = form;
</script>

<h1 class="mb-10 text-2xl font-medium">Create a Tournament</h1>

<form method="POST" class="relative w-full" use:enhance>
	<Form.Field {form} name="timeControl">
		<Form.Control let:attrs>
			<Form.Label>Tournament name</Form.Label>
			<Input {...attrs} bind:value={$formData.timeControl} />
			<Form.Description class="text-xs">
				Kindly pick a safe name for your tournament. An inappropriate name could get your account
				permanently closed.
			</Form.Description>
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="timeControl">
		<Form.Control let:attrs>
			<Form.Label>Tournament type</Form.Label>
			<Input {...attrs} bind:value={$formData.timeControl} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="timeControl">
		<Form.Control let:attrs>
			<Form.Label>Tournament fees</Form.Label>
			<Input {...attrs} bind:value={$formData.timeControl} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="timeControl">
		<Form.Control let:attrs>
			<Form.Label>Tournament fee</Form.Label>
			<Input {...attrs} bind:value={$formData.timeControl} />
		</Form.Control>
		<Form.Description>Private tournaments are not free. A fee is compulsory.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<!-- <div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Form.Button class="w-full rounded-full bg-blue-600 py-3 text-white"
			>create game now</Form.Button
		>
	</div> -->

	<FundWalletAlert />
	<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button href="play" class="w-full rounded-full bg-blue-600 py-3 text-white"
			>Create tournament</Button
		>
	</div>
	<TournamentDrawer />
</form>
