ALTER TABLE "item_masters" RENAME TO "items";--> statement-breakpoint
ALTER TABLE "inventory_unit" DROP CONSTRAINT "inventory_unit_item_code_item_masters_item_code_fk";
--> statement-breakpoint
ALTER TABLE "shelf_inventory" DROP CONSTRAINT "shelf_inventory_item_code_item_masters_item_code_fk";
--> statement-breakpoint
ALTER TABLE "stock_transaction" DROP CONSTRAINT "stock_transaction_item_code_item_masters_item_code_fk";
--> statement-breakpoint
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_item_code_items_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."items"("item_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shelf_inventory" ADD CONSTRAINT "shelf_inventory_item_code_items_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."items"("item_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_item_code_items_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."items"("item_code") ON DELETE no action ON UPDATE no action;