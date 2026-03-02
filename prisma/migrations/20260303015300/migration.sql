/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `section_code` on table `role_permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
ALTER COLUMN "section_code" SET NOT NULL,
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_code", "feature_code", "action", "section_code");
