<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { instantPlaySchema } from '$lib/formSchema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import FundWalletAlert from '$lib/components/FundWalletAlert.svelte';
	let {
		ipForm
	}: {
		ipForm: SuperValidated<Infer<typeof instantPlaySchema>>;
	} = $props();

	const form = superForm(ipForm, {
		validators: zodClient(instantPlaySchema)
	});

	const { enhance, delayed, form: formData } = form;
</script>

<h1 class="mb-10 text-2xl font-medium">Instant Play</h1>

<form method="POST" class="relative w-full" use:enhance>
	<Form.Field {form} name="arenaName">
		<Form.Control let:attrs>
			<Form.Label>Arena name</Form.Label>
			<Input {...attrs} bind:value={$formData.arenaName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="arenaName">
		<Form.Control let:attrs>
			<Form.Label>Variant</Form.Label>
			<Input {...attrs} bind:value={$formData.arenaName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="arenaName">
		<Form.Control let:attrs>
			<Form.Label>Time control</Form.Label>
			<Input {...attrs} bind:value={$formData.arenaName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="arenaName">
		<Form.Control let:attrs>
			<Form.Label>Maximum number of players</Form.Label>
			<Input {...attrs} bind:value={$formData.arenaName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="arenaName">
		<Form.Control let:attrs>
			<Form.Label>Staking amount</Form.Label>
			<Input {...attrs} bind:value={$formData.arenaName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<!-- <div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Form.Button class="w-full rounded-full bg-blue-600 py-3 text-white"
			>create game now</Form.Button
		>
	</div> -->
	<FundWalletAlert />

	<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button href="play" class="w-full rounded-full bg-blue-600 py-3 text-white">Create game</Button>
	</div>
</form>
