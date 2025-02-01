ALTER TABLE `lease` DROP FOREIGN KEY `lease_user_id_user_id_fk`;
--> statement-breakpoint
DROP INDEX `user_id_items_idx` ON `lease`;--> statement-breakpoint
DROP INDEX `category_idx` ON `lease`;--> statement-breakpoint
DROP INDEX `name_items_idx` ON `lease`;--> statement-breakpoint
ALTER TABLE `lease` MODIFY COLUMN `status` enum('pending','active','completed','rejected') NOT NULL;--> statement-breakpoint
ALTER TABLE `lease` ADD `item_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `lease` ADD `lender_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `lease` ADD `borrower_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `lease` ADD `total_amount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `lease` ADD `duration` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `coins` int DEFAULT 500 NOT NULL;--> statement-breakpoint
ALTER TABLE `lease` ADD CONSTRAINT `lease_item_id_item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lease` ADD CONSTRAINT `lease_lender_id_user_id_fk` FOREIGN KEY (`lender_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lease` ADD CONSTRAINT `lease_borrower_id_user_id_fk` FOREIGN KEY (`borrower_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `item_id_idx` ON `lease` (`item_id`);--> statement-breakpoint
CREATE INDEX `lender_id_idx` ON `lease` (`lender_id`);--> statement-breakpoint
CREATE INDEX `borrower_id_idx` ON `lease` (`borrower_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `lease` (`status`);--> statement-breakpoint
ALTER TABLE `lease` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `lease` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `lease` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `lease` DROP COLUMN `image`;--> statement-breakpoint
ALTER TABLE `lease` DROP COLUMN `coins`;