CREATE TYPE "public"."inventory_unit_status" AS ENUM('NORMAL', 'EXPIRED', 'ABNORMAL', 'DAMAGED');--> statement-breakpoint
CREATE TYPE "public"."item_tracking_type" AS ENUM('LABEL', 'QUANTITY');--> statement-breakpoint
CREATE TYPE "public"."stock_transaction_type" AS ENUM('IN', 'OUT', 'DELIVERED', 'MOVE', 'ADJUST');--> statement-breakpoint
CREATE TABLE "inventory_unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag_code" varchar(255) NOT NULL,
	"item_code" varchar(10) NOT NULL,
	"shelf_code" varchar(20) NOT NULL,
	"lot" varchar(30),
	"po_no" varchar(30),
	"invoice_no" varchar(30),
	"quantity" numeric(18, 3) NOT NULL,
	"inspected_date" timestamp (0) with time zone,
	"expiry_date" timestamp (0) with time zone,
	"status" "inventory_unit_status" DEFAULT 'NORMAL' NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8),
	CONSTRAINT "inventory_unit_tag_code_unique" UNIQUE("tag_code")
);
--> statement-breakpoint
CREATE TABLE "racks" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"zone_code" varchar(20) NOT NULL,
	"name" varchar(150) NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
CREATE TABLE "shelf_inventory" (
	"shelf_code" varchar(20) NOT NULL,
	"item_code" varchar(10) NOT NULL,
	"quantity" numeric(18, 3) NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8),
	CONSTRAINT "shelf_inventory_shelf_code_item_code_pk" PRIMARY KEY("shelf_code","item_code")
);
--> statement-breakpoint
CREATE TABLE "shelfts" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"rack_code" varchar(20) NOT NULL,
	"name" varchar(150) NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
CREATE TABLE "stock_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_code" varchar(10) NOT NULL,
	"inventory_unit_id" uuid,
	"from_shelf_code" varchar(20),
	"to_shelf_code" varchar(20),
	"type" "stock_transaction_type" NOT NULL,
	"tracking_type" "item_tracking_type" NOT NULL,
	"quantity" numeric(18, 3) NOT NULL,
	"reference_code" varchar(100),
	"confirmed_at" timestamp (0) with time zone,
	"confirmed_by" char(8),
	"note" varchar(255),
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"warehouse_code" varchar(20) NOT NULL,
	"name" varchar(150) NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
ALTER TABLE "item_masters" ALTER COLUMN "conversion_factor" SET DATA TYPE numeric(18, 3);--> statement-breakpoint
ALTER TABLE "item_masters" ALTER COLUMN "conversion_factor" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "item_masters" ADD COLUMN "tracking_type" "item_tracking_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_item_code_item_masters_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."item_masters"("item_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_unit" ADD CONSTRAINT "inventory_unit_shelf_code_shelfts_code_fk" FOREIGN KEY ("shelf_code") REFERENCES "public"."shelfts"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "racks" ADD CONSTRAINT "racks_zone_code_zones_code_fk" FOREIGN KEY ("zone_code") REFERENCES "public"."zones"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shelf_inventory" ADD CONSTRAINT "shelf_inventory_shelf_code_shelfts_code_fk" FOREIGN KEY ("shelf_code") REFERENCES "public"."shelfts"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shelf_inventory" ADD CONSTRAINT "shelf_inventory_item_code_item_masters_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."item_masters"("item_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shelfts" ADD CONSTRAINT "shelfts_rack_code_racks_code_fk" FOREIGN KEY ("rack_code") REFERENCES "public"."racks"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_item_code_item_masters_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."item_masters"("item_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_inventory_unit_id_inventory_unit_id_fk" FOREIGN KEY ("inventory_unit_id") REFERENCES "public"."inventory_unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_from_shelf_code_shelfts_code_fk" FOREIGN KEY ("from_shelf_code") REFERENCES "public"."shelfts"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transaction" ADD CONSTRAINT "stock_transaction_to_shelf_code_shelfts_code_fk" FOREIGN KEY ("to_shelf_code") REFERENCES "public"."shelfts"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_warehouse_code_warehouses_code_fk" FOREIGN KEY ("warehouse_code") REFERENCES "public"."warehouses"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_created_by_users_username_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;