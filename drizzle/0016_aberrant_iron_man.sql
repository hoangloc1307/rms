CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" char(8) NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" varchar(255) NOT NULL,
	"entity_type" "notification_entity",
	"entity_id" varchar(255),
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_username_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;