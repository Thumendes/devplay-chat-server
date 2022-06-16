-- CreateTable
CREATE TABLE `ResetPasswordToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResetPasswordToken` ADD CONSTRAINT `ResetPasswordToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
