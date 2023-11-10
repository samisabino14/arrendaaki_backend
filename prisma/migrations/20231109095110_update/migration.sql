/*
  Warnings:

  - A unique constraint covering the columns `[fkPerson]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fkPerson` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "accounttypeofaccount_fkAccount_key";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "fkPerson" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_fkPerson_key" ON "accounts"("fkPerson");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fkPerson_fkey" FOREIGN KEY ("fkPerson") REFERENCES "persons"("pkPerson") ON DELETE RESTRICT ON UPDATE CASCADE;
