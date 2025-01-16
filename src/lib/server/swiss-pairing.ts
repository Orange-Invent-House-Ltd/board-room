import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

type Participant = {
    userId: number;
    points: number;
    buchholzScore: number;
    opponentsPlayed: number[];
    hasReceivedBye: boolean;
};

export async function generatePairings(
    db: DrizzleD1Database<typeof schema>,
    tournamentId: number,
    roundNumber: number
) {
    // Get all participants sorted by points and buchholz score
    const participants = await db.query.participantsTable.findMany({
        where: eq(schema.participantsTable.tournamentId, tournamentId),
        orderBy: [
            desc(schema.participantsTable.points),
            desc(schema.participantsTable.buchholzScore)
        ]
    });

    if (participants.length === 0) {
        throw error(400, 'No participants found');
    }

    const pairs: [Participant, Participant | null][] = [];
    const used = new Set<number>();

    // Handle odd number of players - give bye to lowest scoring player who hasn't had a bye
    if (participants.length % 2 === 1) {
        for (let i = participants.length - 1; i >= 0; i--) {
            const player = participants[i];
            if (!player.hasReceivedBye) {
                pairs.push([player, null]); // Bye match
                used.add(player.userId);
                break;
            }
        }
    }

    // Group players by points
    const pointGroups = new Map<number, Participant[]>();
    for (const player of participants) {
        if (!used.has(player.userId)) {
            const points = player.points;
            if (!pointGroups.has(points)) {
                pointGroups.set(points, []);
            }
            pointGroups.get(points)?.push(player);
        }
    }

    // Sort point groups by points (descending)
    const sortedPoints = Array.from(pointGroups.keys()).sort((a, b) => b - a);

    // Pair within each point group
    for (const points of sortedPoints) {
        const group = pointGroups.get(points) || [];
        let unpaired = group.filter(p => !used.has(p.userId));

        while (unpaired.length >= 2) {
            const player1 = unpaired[0];
            let bestOpponentIndex = 1;

            // Find best opponent (one not previously played if possible)
            for (let i = 1; i < unpaired.length; i++) {
                const potentialOpponent = unpaired[i];
                if (!player1.opponentsPlayed.includes(potentialOpponent.userId)) {
                    bestOpponentIndex = i;
                    break;
                }
            }

            const player2 = unpaired[bestOpponentIndex];
            pairs.push([player1, player2]);
            used.add(player1.userId);
            used.add(player2.userId);
            unpaired = unpaired.filter(p => !used.has(p.userId));
        }

        // If there's one player left, try to pair with next point group
        if (unpaired.length === 1) {
            const nextPointIndex = sortedPoints.indexOf(points) + 1;
            if (nextPointIndex < sortedPoints.length) {
                const nextGroup = pointGroups.get(sortedPoints[nextPointIndex]) || [];
                const nextOpponent = nextGroup.find(p => !used.has(p.userId));
                if (nextOpponent) {
                    pairs.push([unpaired[0], nextOpponent]);
                    used.add(unpaired[0].userId);
                    used.add(nextOpponent.userId);
                }
            }
        }
    }

    // Create matches in database
    for (const [player1, player2] of pairs) {
        const isBye = player2 === null;
        await db.insert(schema.matches).values({
            tournamentId,
            roundNumber,
            player1Id: player1.userId,
            player2Id: player2?.userId || null,
            status: 'SCHEDULED',
            result: isBye ? 'BYE' : 'ONGOING',
            isBye
        });

        if (isBye) {
            // Update participant's bye status and points
            await db
                .update(schema.participantsTable)
                .set({
                    hasReceivedBye: true,
                    points: sql`${schema.participantsTable.points} + 1`
                })
                .where(
                    and(
                        eq(schema.participantsTable.tournamentId, tournamentId),
                        eq(schema.participantsTable.userId, player1.userId)
                    )
                );
        }
    }

    // Update tournament status
    await db
        .update(schema.tournamentsTable)
        .set({
            currentRound: roundNumber,
        })
        .where(eq(schema.tournamentsTable.id, tournamentId));

    return pairs;
}

export async function updateBuchholzScores(
    db: DrizzleD1Database<typeof schema>,
    tournamentId: number
) {
    const participants = await db.query.participantsTable.findMany({
        where: eq(schema.participantsTable.tournamentId, tournamentId)
    });

    for (const participant of participants) {
        const opponents = participant.opponentsPlayed;
        let buchholzScore = 0;

        // Sum up the points of all opponents
        for (const opponentId of opponents) {
            const opponent = await db.query.participantsTable.findFirst({
                where: and(
                    eq(schema.participantsTable.tournamentId, tournamentId),
                    eq(schema.participantsTable.userId, opponentId)
                )
            });
            if (opponent) {
                buchholzScore += opponent.points;
            }
        }

        // Update the participant's Buchholz score
        await db
            .update(schema.participantsTable)
            .set({ buchholzScore })
            .where(
                and(
                    eq(schema.participantsTable.tournamentId, tournamentId),
                    eq(schema.participantsTable.userId, participant.userId)
                )
            );
    }
}
