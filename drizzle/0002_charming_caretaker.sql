CREATE TABLE "item_masters" (
	"item_code" char(10) PRIMARY KEY NOT NULL,
	"product_code" char(10) NOT NULL,
	"name" varchar(150) NOT NULL,
	"unit" varchar(20) NOT NULL,
	"base_unit" varchar(20) NOT NULL,
	"conversion_factor" integer DEFAULT 1 NOT NULL,
	"delivery_on_base_unit" boolean DEFAULT true NOT NULL,
	"note" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
