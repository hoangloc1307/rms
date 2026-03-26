ALTER TABLE "shelfts" RENAME TO "shelves";--> statement-breakpoint
ALTER TABLE "inventory_unit" DROP CONSTRAINT "inventory_unit_shelf_code_shelfts_code_fk";
--> statement-breakpoint
ALTER TABLE "shelf_inventory" DROP CONSTRAINT "shelf_inventory_shelf_code_shelfts_code_fk";
--> statement-breakpoint
ALTER TABLE "shelves" DROP CONSTRAINT "shelfts_rack_code_racks_code_fk";
--> statement-breakpoint
ALTER TABLE "stock_transaction" DROP CONSTRAINT "stock_transaction_from_shelf_code_shelfts_code_fk";
--> statement-breakpoint
ALTER TABLE "stock_transaction" DROP CONSTRAINT "stock_transaction_to_shelf_code_shelfts_code_fk";
--> statement-breakpoint
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_shelf_code_shelves_code_fk" FOREIGN KEY ("shelf_code") REFERENCES "public"."shelves"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shelf_inventory" ADD CONSTRAINT "shelf_inventory_shelf_code_shelves_code_fk" FOREIGN KEY ("shelf_code") REFERENCES "public"."shelves"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shelves" ADD CONSTRAINT "shelves_rack_code_racks_code_fk" FOREIGN KEY ("rack_code") REFERENCES "public"."racks"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_from_shelf_code_shelves_code_fk" FOREIGN KEY ("from_shelf_code") REFERENCES "public"."shelves"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_to_shelf_code_shelves_code_fk" FOREIGN KEY ("to_shelf_code") REFERENCES "public"."shelves"("code") ON DELETE no action ON UPDATE no action;