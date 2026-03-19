CREATE TABLE "import_job_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"row_number" integer NOT NULL,
	"row_key" varchar(100) NOT NULL,
	"action" "import_action" NOT NULL,
	"raw_data" jsonb NOT NULL,
	"normalized_data" jsonb NOT NULL,
	"diff_data" jsonb,
	"error_data" jsonb
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" "import_status" NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"total_rows" integer NOT NULL,
	"created_rows" integer NOT NULL,
	"updated_rows" integer NOT NULL,
	"skipped_rows" integer NOT NULL,
	"error_rows" integer NOT NULL,
	"expired_at" timestamp (0) with time zone NOT NULL,
	"committed_at" timestamp (0) with time zone,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"created_by" char(8) NOT NULL,
	CONSTRAINT "import_jobs_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "import_job_rows" ADD CONSTRAINT "import_job_rows_job_id_import_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."import_jobs"("id") ON DELETE no action ON UPDATE no action;