import { z } from 'zod';

export const createTournamentSchema = z.object({
	timeControl: z.string().min(1)
});
