import { z } from 'zod';

export const playWithComputerSchema = z.object({
	variant: z.string().min(1),
	minutes: z.number().int().min(1),
	stakingAmount: z.number().int().min(1)
});
export const scheduleGameSchema = z.object({
	opponentUserName: z.string().min(1)
});
export const createTournamentSchema = z.object({
	timeControl: z.string().min(1)
});
export const instantPlaySchema = z.object({
	arenaName: z.string().min(1)
});

export const playWithFriendSchema = z.object({
	friendUsername: z
		.string()
		.min(3, 'Username must be at least 3 characters long')
		.max(30, 'Username must not exceed 30 characters'),

	variant: z.enum(['standard', 'blitz', 'rapid'], {
		required_error: 'Please select a game variant'
	}),

	timeControl: z.enum(['5+0', '10+0', '15+10'], {
		required_error: 'Please select a time control'
	}),

	stakingAmount: z
		.string()
		.min(1, 'Staking amount is required')
		.refine((val) => !isNaN(Number(val.replace(/,/g, ''))), 'Please enter a valid number')
		.transform((val) => Number(val.replace(/,/g, '')))
		.refine((val) => val >= 100, 'Minimum staking amount is ₦100')
		.refine((val) => val <= 1000000, 'Maximum staking amount is ₦1,000,000')
});
export const CatRpsSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		type: z.enum(['public', 'private']),
		maximumPlayers: z
			.number()
			.int()
			.min(2, 'Minimum players is 2')
			.max(10, 'Maximum players is 10')
			.refine((value) => value % 2 === 0, {
				message: 'Maximum players must be an even number'
			}),
		startTime: z
			.string()
			.refine(
				(value) => {
					const date = new Date(value);
					return !isNaN(date.getTime());
				},
				{
					message: 'Invalid date format'
				}
			)
			.refine(
				(value) => {
					const date = new Date(value);
					const now = new Date();
					return date > now;
				},
				{
					message: 'Start time must be in the future'
				}
			),
		fee: z.number().int().optional()
	})
	.refine(
		(data) => {
			if (data.type === 'private') {
				return data.fee === 0;
			}
			return true;
		},
		{
			message: 'Fee is required for private games',
			path: ['fee']
		}
	);
export const PwfRpsSchema = z.object({
	username: z.string().min(5),
	stakingAmount: z.number().int().optional(),
	numberOfRounds: z
		.number()
		.int()
		.min(1, 'Number of rounds is required')
		.max(100, 'Maximum number of rounds is 100')
		.refine((val) => val % 2 !== 0, 'Number of rounds must be an odd number')
});

export type PlayWithFriendFormData = z.infer<typeof playWithFriendSchema>;
