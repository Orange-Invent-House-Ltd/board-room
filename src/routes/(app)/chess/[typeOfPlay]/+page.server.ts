import {
	createTournamentSchema,
	instantPlaySchema,
	playWithComputerSchema,
	playWithFriendSchema,
	scheduleGameSchema
} from '$lib/formSchema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const pwcForm = await superValidate(zod(playWithComputerSchema));
	const pwfForm = await superValidate(zod(playWithFriendSchema));
	const sagForm = await superValidate(zod(scheduleGameSchema));
	const catForm = await superValidate(zod(createTournamentSchema));
	const ipForm = await superValidate(zod(instantPlaySchema));

	return {
		pwcForm,
		pwfForm,
		sagForm,
		catForm,
		ipForm
	};
};
