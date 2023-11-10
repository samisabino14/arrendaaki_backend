/*
  Warnings:

  - You are about to drop the column `fkPerson` on the `accounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_fkPerson_fkey";

-- DropIndex
DROP INDEX "accounts_fkPerson_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "fkPerson";
