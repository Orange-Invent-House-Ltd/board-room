<script lang="ts" module>
	import { z } from 'zod';

	export const formSchema = z.object({
		email: z.string({ required_error: 'Please select an email to display' }).email()
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import SuperDebug, {
		type Infer,
		type SuperValidated,
		superForm,
		defaults
	} from 'sveltekit-superforms';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const form = superForm(defaults(zod(formSchema)), {
		validators: zodClient(formSchema),
		SPA: true
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="/?/select" class="w-2/3 space-y-6" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control>
			<Form.Label>Email</Form.Label>
			<Select.Root type="single" bind:value={$formData.email}>
				<Select.Trigger>
					{$formData.email ?? 'Select a verified email to display'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="m@example.com" label="m@example.com" />
					<Select.Item value="m@google.com" label="m@google.com" />
					<Select.Item value="m@support.com" label="m@support.com" />
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.Description>
			You can manage email address in your yes <a href="/examples/forms">email settings</a>.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
