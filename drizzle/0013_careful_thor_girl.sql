ALTER TABLE "inventory_unit" ADD COLUMN "label_id" char(14) NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_label_id_unique" UNIQUE("label_id");