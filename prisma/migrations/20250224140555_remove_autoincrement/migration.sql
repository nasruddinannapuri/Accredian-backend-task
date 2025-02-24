/*
  Warnings:

  - A unique constraint covering the columns `[referrerEmail,refereeEmail]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refereeEmail]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `referral` MODIFY `id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Referral_referrerEmail_refereeEmail_key` ON `Referral`(`referrerEmail`, `refereeEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `Referral_refereeEmail_key` ON `Referral`(`refereeEmail`);
