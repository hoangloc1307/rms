/*
  Warnings:

  - The values [CRUD] on the enum `Action` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Action_new" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'APPROVE');
ALTER TABLE "role_permission" ALTER COLUMN "action" TYPE "Action_new" USING ("action"::text::"Action_new");
ALTER TABLE "user_permissions" ALTER COLUMN "action" TYPE "Action_new" USING ("action"::text::"Action_new");
ALTER TYPE "Action" RENAME TO "Action_old";
ALTER TYPE "Action_new" RENAME TO "Action";
DROP TYPE "public"."Action_old";
COMMIT;

-- AlterTable
ALTER TABLE "role_permission" ADD COLUMN     "section_code" CHAR(4);
