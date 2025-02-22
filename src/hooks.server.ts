import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/auth/session';
import { createClient } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const preloadFonts: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		preload: ({ type }) => type === 'font'
	});

	return response;
};

const handleDb: Handle = async ({ event, resolve }) => {
	// Initialize database client
	const platform = event.platform;
	if (platform) {
		const db = await createClient(platform.env.DB);

		event.locals.db = db;
	}
	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	if (!event.locals.db) {
		console.error('Database not initialized');
		return resolve(event);
	}

	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token, event.locals.db);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
};

export const handle = sequence(preloadFonts, handleDb, handleAuth);
