export const GAME_STATUS = ['IN_PROGRESS', 'COMPLETED', 'ABORTED'] as const;
export const TOURNAMENT_TYPE = ['public', 'private'] as const;
export const NOTIFICATION_TYPE = ['FRIEND_INVITATION'] as const;
export const GAME_TYPE = ['COMPUTER', 'FRIEND'] as const;
export const INVITATION_STATUS = ['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED'] as const;
export const OPPONENT_TYPE = ['HUMAN', 'COMPUTER'] as const;
export const GAME_RESULT = ['WIN', 'LOSE', 'DRAW'] as const;


export type GameResult = (typeof GAME_RESULT)[number];
