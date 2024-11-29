import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { GAME_STATUS, INVITATION_STATUS, TOURNAMENT_TYPE } from '../../constants';

// Example schema - modify according to your needs
export const timestamps = {
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at').$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
};
export function array<T>() {
	return text('', { mode: 'json' }).$type<T[]>();
}

export const usersTable = sqliteTable('users', {
	id: integer('id').primaryKey(),
	googleId: text('google_id').unique(),
	name: text('name').notNull(),
	email: text('email').unique(),
	picture: text('picture'),
	xHandle: text('x_handle'),
	instagramHandle: text('instagram_handle'),
	facebookHandle: text('facebook_handle'),
	username: text('username').unique().notNull(),
	...timestamps
});

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: integer('expires_at', {
		mode: 'timestamp'
	}).notNull()
});
export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export const gamesTable = sqliteTable('games', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

export const statsTable = sqliteTable(
	'stats',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id),
		gameId: integer('game_id')
			.notNull()
			.references(() => gamesTable.id),
		globalRanking: integer('global_ranking').notNull(),
		gamesPlayed: integer('games_played').notNull().default(0),
		gamesWon: integer('games_won').notNull().default(0),
		gamesLost: integer('games_lost').notNull().default(0),
		gamesDrawn: integer('games_drawn').notNull().default(0),
		...timestamps
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.gameId] })
	})
);
// User relations
export const userRelations = relations(usersTable, ({ many }) => ({
	stats: many(statsTable)
}));

// Game relations
export const gamesRelations = relations(gamesTable, ({ many }) => ({
	stats: many(statsTable)
}));

// Stats relations
export const statsRelations = relations(statsTable, ({ one }) => ({
	game: one(gamesTable, {
		fields: [statsTable.gameId],
		references: [gamesTable.id]
	}),
	user: one(usersTable, {
		fields: [statsTable.userId],
		references: [usersTable.id]
	})
}));
export const gameHistoryTable = sqliteTable('game_history', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	gameId: integer('game_id')
		.notNull()
		.references(() => gamesTable.id),
	playerOneId: integer('player_one_id')
		.notNull()
		.references(() => usersTable.id),
	// Nullable for computer opponent
	playerTwoId: integer('player_two_id').references(() => usersTable.id),
	// true for computer opponent
	isComputerOpponent: integer('is_computer_opponent', { mode: 'boolean' }).notNull().default(false),
	winner: integer('winner').references(() => usersTable.id),
	status: text('status', { enum: GAME_STATUS }).notNull().default('IN_PROGRESS'),
	stakingAmount: integer('staking_amount'),
	...timestamps
});
// Friend game invitations table
export const friendGameInvitationsTable = sqliteTable('friend_game_invitations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	initiatorId: integer('initiator_id')
		.notNull()
		.references(() => usersTable.id),
	invitedUserId: integer('invited_user_id')
		.notNull()
		.references(() => usersTable.id),
	stakingAmount: integer('staking_amount'),
	status: text('status', { enum: INVITATION_STATUS }).notNull().default('PENDING'),
	gameId: integer('game_id').references(() => gamesTable.id),
	inviteCode: text('invite_code').notNull(),

	...timestamps
});

// For storing moves within a game
export const movesTable = sqliteTable('moves', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	gameHistoryId: integer('game_history_id')
		.notNull()
		.references(() => gameHistoryTable.id),
	playerId: integer('player_id')
		.notNull()
		.references(() => usersTable.id),
	// Store move as JSON to support different game move types
	move: text('move').notNull(),
	roundNumber: integer('round_number').notNull().default(1),
	...timestamps
});

export const tournamentsTable = sqliteTable('tournaments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	gameId: integer('game_id')
		.references(() => gamesTable.id)
		.notNull(),
	duration: integer('duration').notNull(),
	type: text('type', { enum: TOURNAMENT_TYPE }).notNull(),
	maxPlayers: integer('max_players').notNull(),
	startTime: integer('start_time', { mode: 'timestamp' }),
	endTime: integer('end_time', { mode: 'timestamp' }),
	status: text('status', { enum: ['UPCOMING', 'LIVE', 'COMPLETED'] }).notNull(),
	currentPlayers: integer('current_players').default(0),
	userId: integer('user_id').references(() => usersTable.id),
	fee: integer('fee').default(0).notNull(),
	numberOfRounds: integer('number_of_rounds'),
	...timestamps
});

export const participantsTable = sqliteTable(
	'participants',
	{
		tournamentId: integer('tournament_id')
			.references(() => tournamentsTable.id)
			.notNull(),
		userId: integer('user_id')
			.references(() => usersTable.id)
			.notNull(),
		points: integer('points').default(0),
		wins: integer('wins').default(0),
		draws: integer('draws').default(0),
		losses: integer('losses').default(0),
		joinedAt: integer('joined_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		...timestamps
	},
	(table) => ({
		pk: primaryKey({ columns: [table.tournamentId, table.userId], name: 'id' })
	})
);

export const matches = sqliteTable('matches', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	tournamentId: integer('tournament_id').references(() => tournamentsTable.id),
	player1Id: integer('player_1_id').references(() => usersTable.id),
	player2Id: integer('player_2_id').references(() => usersTable.id),
	winnerId: integer('winner_id').references(() => usersTable.id),
	result: text('result', { enum: ['WIN', 'DRAW', 'ONGOING'] }),
	startTime: integer('start_time', { mode: 'timestamp' }),
	endTime: integer('end_time', { mode: 'timestamp' }),
	status: text('status', { enum: ['SCHEDULED', 'LIVE', 'COMPLETED'] }).default('SCHEDULED'),
	...timestamps
});

export const notificationsTable = sqliteTable('notifications', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	senderId: integer('sender_id').references(() => usersTable.id),
	receiverId: integer('receiver_id').references(() => usersTable.id),
	message: text('message'),
	readStatus: integer('read_status', { mode: 'boolean' }).default(false),
	inviteCode: text('invite_code'),
	...timestamps
});

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
	sender: one(usersTable, {
		fields: [notificationsTable.senderId],
		references: [usersTable.id]
	}),
	receiver: one(usersTable, {
		fields: [notificationsTable.receiverId],
		references: [usersTable.id]
	})
}));

export const tournamentsRelations = relations(tournamentsTable, ({ one, many }) => ({
	game: one(gamesTable, {
		fields: [tournamentsTable.gameId],
		references: [gamesTable.id]
	}),
	creator: one(usersTable, {
		fields: [tournamentsTable.userId],
		references: [usersTable.id]
	}),
	participants: many(participantsTable)
}));

export const participantsRelations = relations(participantsTable, ({ one }) => ({
	tournament: one(tournamentsTable, {
		fields: [participantsTable.tournamentId],
		references: [tournamentsTable.id]
	}),
	user: one(usersTable, {
		fields: [participantsTable.userId],
		references: [usersTable.id]
	})
}));
