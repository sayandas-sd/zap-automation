/*
  Warnings:

  - Added the required column `metadata` to the `TaskRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskRun" ADD COLUMN     "metadata" JSONB NOT NULL;
