CREATE TABLE "users" (
	"username" char(8) PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(254),
	"password" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
