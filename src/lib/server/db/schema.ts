import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { GAME_STATUS } from '../../constants';

// Example schema - modify according to your needs
export const timestamps = {
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text().$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
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
	xHandle: text(),
	instagramHandle: text(),
	facebookHandle: text(),
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
		userId: integer()
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
	id: integer().primaryKey({ autoIncrement: true }),
	gameId: integer()
		.notNull()
		.references(() => gamesTable.id),
	playerOneId: integer()
		.notNull()
		.references(() => usersTable.id),
	// Nullable for computer opponent
	playerTwoId: integer().references(() => usersTable.id),
	// true for computer opponent
	isComputerOpponent: integer({ mode: 'boolean' }).notNull().default(false),
	winner: integer().references(() => usersTable.id),
	status: text({ enum: GAME_STATUS }).notNull().default('IN_PROGRESS'),
	...timestamps
});

// For storing moves within a game
export const movesTable = sqliteTable('moves', {
	id: integer().primaryKey({ autoIncrement: true }),
	gameHistoryId: integer()
		.notNull()
		.references(() => gameHistoryTable.id),
	playerId: integer()
		.notNull()
		.references(() => usersTable.id),
	// Store move as JSON to support different game move types
	move: text('move').notNull(),
	roundNumber: integer().notNull().default(1),
	...timestamps
});

export const tournamentsTable = sqliteTable('tournaments', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	gameId: integer().references(() => gamesTable.id),
	prize: integer().notNull(),
	gameMode: text().notNull(),
	duration: integer().notNull(),
	type: text({ enum: ['PUBLIC', 'PRIVATE'] }).notNull(),
	maxPlayers: integer().notNull(),
	startTime: integer('start', { mode: 'timestamp' }).notNull(),
	endTime: integer('end', { mode: 'timestamp' }),
	status: text({ enum: ['UPCOMING', 'LIVE', 'COMPLETED'] }).notNull(),
	currentPlayers: integer().default(0)
});

export const participantsTable = sqliteTable(
	'participants',
	{
		tournamentId: integer().references(() => tournamentsTable.id),
		userId: integer().references(() => usersTable.id),
		points: integer().default(0),
		wins: integer().default(0),
		draws: integer().default(0),
		losses: integer().default(0),
		joinedAt: integer('joined', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.tournamentId, table.userId], name: 'id' })
	})
);

export const matches = sqliteTable('matches', {
	id: integer().primaryKey({ autoIncrement: true }),
	tournamentId: integer().references(() => tournamentsTable.id),
	player1Id: integer().references(() => usersTable.id),
	player2Id: integer().references(() => usersTable.id),
	winnerId: integer().references(() => usersTable.id),
	result: text({ enum: ['WIN', 'DRAW', 'ONGOING'] }),
	startTime: integer('start', { mode: 'timestamp' }),
	endTime: integer('end', { mode: 'timestamp' }),
	status: text({ enum: ['SCHEDULED', 'LIVE', 'COMPLETED'] }).default('SCHEDULED')
});
