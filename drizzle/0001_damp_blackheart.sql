CREATE TABLE `profile` (
	`id` text PRIMARY KEY DEFAULT 'local' NOT NULL,
	`goal` text,
	`struggling_habit` text,
	`time_budget` text,
	`preferred_moment` text,
	`common_blocker` text,
	`accompaniment_style` text,
	`completed_at` text NOT NULL
);
