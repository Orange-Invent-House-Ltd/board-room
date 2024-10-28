<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { playWithComputerSchema } from '$lib/formSchema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	let {
		pwcForm
	}: {
		pwcForm: SuperValidated<Infer<typeof playWithComputerSchema>>;
	} = $props();

	const form = superForm(pwcForm, {
		validators: zodClient(playWithComputerSchema)
	});

	const { enhance, delayed, form: formData } = form;
</script>

<h1 class="mb-10 text-2xl font-medium">Play With Computer</h1>

<form method="POST" class="relative w-full" use:enhance>
	<Form.Field {form} name="variant">
		<Form.Control let:attrs>
			<Form.Label>Variant</Form.Label>
			<Input {...attrs} bind:value={$formData.variant} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="minutes">
		<Form.Control let:attrs>
			<Form.Label>Minutes per side</Form.Label>
			<Input {...attrs} bind:value={$formData.minutes} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="stakingAmount">
		<Form.Control let:attrs>
			<Form.Label>Staking amount</Form.Label>
			<Input {...attrs} bind:value={$formData.stakingAmount} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="stakingAmount">
		<Form.Control let:attrs>
			<Form.Label>Staking amount</Form.Label>
			<Input {...attrs} bind:value={$formData.stakingAmount} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<!-- <div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Form.Button class="w-full rounded-full bg-blue-600 py-3 text-white"
			>create game now</Form.Button
		>
	</div> -->
	<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button href="play" class="w-full rounded-full bg-blue-600 py-3 text-white"
			>create game now</Button
		>
	</div>
</form>
