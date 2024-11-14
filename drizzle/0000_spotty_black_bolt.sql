CREATE TABLE `adoption_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `adoption_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `adoption_animals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`species` text(256),
	`age` integer,
	`description` text(1024),
	`main_image` text(256),
	`gallery` text DEFAULT (json_array()) NOT NULL,
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`created_by`) REFERENCES `adoption_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `adoption_profiles` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`title` text(255),
	`slug` text(255),
	`bio` text(255),
	`location` text(255),
	`website` text(255),
	`twitter` text(255),
	`instagram` text(255),
	`description` text(255),
	FOREIGN KEY (`user_id`) REFERENCES `adoption_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `adoption_session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `adoption_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `adoption_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT (unixepoch()),
	`role` text NOT NULL,
	`image` text(255),
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `adoption_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `adoption_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `adoption_animals` (`created_by`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `adoption_animals` (`name`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `adoption_session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `adoption_user_email_unique` ON `adoption_user` (`email`);