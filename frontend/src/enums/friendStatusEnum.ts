export const FriendStatus = {
    PENDING: 0,
    ACCEPTED: 1
} as const;

export type FriendStatus = typeof FriendStatus[keyof typeof FriendStatus];