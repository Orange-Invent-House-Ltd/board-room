CREATE TABLE `friend_game_invitations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`initiator_id` integer NOT NULL,
	`invited_user_id` integer NOT NULL,
	`staking_amount` integer,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`game_id` integer,
	`invite_code` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text,
	FOREIGN KEY (`initiator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invited_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `game_history` ADD `staking_amount` integer;