<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { scheduleGameSchema } from '$lib/formSchema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import FundWalletAlert from '$lib/components/FundWalletAlert.svelte';
	import ScheduleDrawer from '$lib/components/Drawers/ScheduleDrawer.svelte';
	let {
		sagForm
	}: {
		sagForm: SuperValidated<Infer<typeof scheduleGameSchema>>;
	} = $props();

	const form = superForm(sagForm, {
		validators: zodClient(scheduleGameSchema)
	});

	const { enhance, delayed, form: formData } = form;
</script>

<h1 class="mb-10 text-2xl font-medium">Schedule a Game</h1>

<form method="POST" class="relative w-full" use:enhance>
	<Form.Field {form} name="opponentUserName">
		<Form.Control let:attrs>
			<Form.Label>Opponent's username</Form.Label>
			<Input {...attrs} bind:value={$formData.opponentUserName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<div class="flex items-center gap-5">
		<Form.Field {form} name="opponentUserName">
			<Form.Control let:attrs>
				<Form.Label>Schedule date</Form.Label>
				<Input {...attrs} bind:value={$formData.opponentUserName} />
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="opponentUserName">
			<Form.Control let:attrs>
				<Form.Label>Schedule time</Form.Label>
				<Input {...attrs} bind:value={$formData.opponentUserName} />
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Field {form} name="opponentUserName">
		<Form.Control let:attrs>
			<Form.Label>Variant</Form.Label>
			<Input {...attrs} bind:value={$formData.opponentUserName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field><Form.Field {form} name="opponentUserName">
		<Form.Control let:attrs>
			<Form.Label>Time Control</Form.Label>
			<Input {...attrs} bind:value={$formData.opponentUserName} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field><Form.Field {form} name="opponentUserName">
		<Form.Control let:attrs>
			<Form.Label>Staking amount N</Form.Label>
			<Input {...attrs} bind:value={$formData.opponentUserName} />
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
		<Button href="play" class="w-full rounded-full bg-blue-600 py-3 text-white"
			>Schedule game</Button
		>
	</div>
	<ScheduleDrawer />
</form>
