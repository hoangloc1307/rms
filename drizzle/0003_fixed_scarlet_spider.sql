ALTER TABLE "item_masters" ALTER COLUMN "conversion_factor" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "item_masters" ALTER COLUMN "conversion_factor" SET DEFAULT '1';