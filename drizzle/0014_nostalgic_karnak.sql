CREATE TABLE "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"path" varchar(255) NOT NULL,
	"icon" varchar(255),
	"parent_id" integer,
	"order" integer DEFAULT 0 NOT NULL,
	"feature_code" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_menus_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_feature_code_features_code_fk" FOREIGN KEY ("feature_code") REFERENCES "public"."features"("code") ON DELETE no action ON UPDATE no action;