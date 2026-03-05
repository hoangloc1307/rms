CREATE TYPE "public"."action" AS ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'APPROVAL');--> statement-breakpoint
CREATE TYPE "public"."decision" AS ENUM('ALLOW', 'DENY');--> statement-breakpoint
CREATE TABLE "roles" (
	"code" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"username" char(8) NOT NULL,
	"role_code" varchar(50) NOT NULL,
	"section_code" char(4) NOT NULL,
	CONSTRAINT "user_role_username_role_code_section_code_pk" PRIMARY KEY("username","role_code","section_code")
);
--> statement-breakpoint
CREATE TABLE "features" (
	"code" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8)
);
--> statement-breakpoint
CREATE TABLE "role_permission" (
	"role_code" varchar(50) NOT NULL,
	"feature_code" varchar(100) NOT NULL,
	"action" "action" NOT NULL,
	"section_code" char(4) NOT NULL,
	"decision" "decision" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8),
	CONSTRAINT "role_permission_role_code_feature_code_action_section_code_pk" PRIMARY KEY("role_code","feature_code","action","section_code")
);
--> statement-breakpoint
CREATE TABLE "user_permission" (
	"username" char(8) NOT NULL,
	"feature_code" varchar(100) NOT NULL,
	"action" "action" NOT NULL,
	"decision" "decision" NOT NULL,
	"section_code" char(4) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	"updated_at" timestamp (0) with time zone,
	"updated_by" char(8),
	CONSTRAINT "user_permission_username_feature_code_action_section_code_pk" PRIMARY KEY("username","feature_code","action","section_code")
);
--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_code_roles_code_fk" FOREIGN KEY ("role_code") REFERENCES "public"."roles"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_code_roles_code_fk" FOREIGN KEY ("role_code") REFERENCES "public"."roles"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_feature_code_features_code_fk" FOREIGN KEY ("feature_code") REFERENCES "public"."features"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_feature_code_features_code_fk" FOREIGN KEY ("feature_code") REFERENCES "public"."features"("code") ON DELETE no action ON UPDATE no action;