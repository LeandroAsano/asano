ALTER TABLE `habits` ADD `category` text DEFAULT 'salud' NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `difficulty` text DEFAULT 'media' NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `frequency_type` text DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `days_of_week` text;--> statement-breakpoint
ALTER TABLE `habits` ADD `times_per_week` integer;--> statement-breakpoint
ALTER TABLE `habits` ADD `anchor_type` text DEFAULT 'time' NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `time_of_day` text;--> statement-breakpoint
ALTER TABLE `habits` ADD `trigger_text` text;