CREATE TABLE `adjustments` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`source_log_id` text,
	`reason` text,
	`type` text NOT NULL,
	`applied` integer DEFAULT false NOT NULL,
	`suggested_at` text NOT NULL,
	`applied_at` text,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `habit_logs` ADD `reason` text;--> statement-breakpoint
ALTER TABLE `habit_logs` ADD `note` text;