import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createTournamentSchema } from '../components/schema';

export const load = async () => {
	const catForm = await superValidate(zod(createTournamentSchema));

	return {
		catForm
	};
};
