CREATE TABLE `item` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(255),
	`coins` int NOT NULL DEFAULT 0,
	`period` int NOT NULL DEFAULT 1,
	`category` enum('electronics','clothing','books','sports','tools','other') NOT NULL,
	`status` enum('listed','leased','delisted') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lease` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(255),
	`coins` int NOT NULL DEFAULT 0,
	`status` enum('active','completed','overdue') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `lease_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`hash` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `password_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(128) NOT NULL,
	`name` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `item` ADD CONSTRAINT `item_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lease` ADD CONSTRAINT `lease_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `password` ADD CONSTRAINT `password_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_id_items_idx` ON `item` (`user_id`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `item` (`category`);--> statement-breakpoint
CREATE INDEX `name_items_idx` ON `item` (`name`);--> statement-breakpoint
CREATE INDEX `user_id_items_idx` ON `lease` (`user_id`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `lease` (`status`);--> statement-breakpoint
CREATE INDEX `name_items_idx` ON `lease` (`name`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `password` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_session_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `user` (`name`);