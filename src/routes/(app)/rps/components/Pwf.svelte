<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { playWithFriendSchema } from '$lib/formSchema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import InviteDrawer from '$lib/components/Drawers/InviteDrawer.svelte';

	let {
		pwfForm
	}: {
		pwfForm: SuperValidated<Infer<typeof playWithFriendSchema>>;
	} = $props();

	const form = superForm(pwfForm, {
		validators: zodClient(playWithFriendSchema)
	});

	const { enhance, delayed, form: formData } = form;
</script>

<div class="mb-10 min-h-screen bg-black text-white">
	<h1 class="mb-6 text-2xl font-medium">Play With Friend</h1>

	<form method="POST" class="space-y-4" use:enhance>
		<Form.Field {form} name="friendUsername">
			<Form.Control let:attrs>
				<Form.Label>Friend's username</Form.Label>
				<Input {...attrs} bind:value={$formData.friendUsername} placeholder="e.g Beast_Mode" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="variant">
			<Form.Control let:attrs>
				<Form.Label>Variant</Form.Label>
				<select
					{...attrs}
					bind:value={$formData.variant}
					class="h-[56px] w-full rounded bg-white p-2 text-black"
				>
					<option value="" disabled selected>Choose variant</option>
					<option value="standard">Standard</option>
					<option value="blitz">Blitz</option>
					<option value="rapid">Rapid</option>
				</select>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="timeControl">
			<Form.Control let:attrs>
				<Form.Label>Time control</Form.Label>
				<select
					{...attrs}
					bind:value={$formData.timeControl}
					class="h-[56px] w-full rounded bg-white p-2 text-black"
				>
					<option value="" disabled selected>Select time control</option>
					<option value="5+0">5+0</option>
					<option value="10+0">10+0</option>
					<option value="15+10">15+10</option>
				</select>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="stakingAmount">
			<Form.Control let:attrs>
				<Form.Label>Staking amount ₦</Form.Label>
				<Input {...attrs} bind:value={$formData.stakingAmount} placeholder="e.g 1,000" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="mt-6 rounded-lg bg-orange-700 p-4">
			<h2 class="mb-2 font-semibold">Fund Your Wallet!</h2>
			<p class="mb-2 text-sm">
				Take advantage of this opportunity to fund your wallet and stake more to increase your
				excitement and rewards.
			</p>
			<button
				type="button"
				class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-700"
				>Fund wallet</button
			>
		</div>

		<div class="sticky bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
			<Form.Button class="w-full rounded-full bg-blue-600 py-3 text-white">Send invite</Form.Button>
		</div>
		<InviteDrawer />
	</form>
</div>
