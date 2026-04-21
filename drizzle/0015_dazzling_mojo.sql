CREATE TYPE "public"."notification_entity" AS ENUM('IMPORT', 'TASK');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('TASK', 'IMPORT', 'SYSTEM');