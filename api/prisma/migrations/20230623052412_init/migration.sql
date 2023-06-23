-- CreateTable
CREATE TABLE `MovieReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `authorId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `rate` INTEGER NOT NULL,
    `content` TEXT NOT NULL,

    UNIQUE INDEX `MovieReview_authorId_key`(`authorId`),
    UNIQUE INDEX `MovieReview_movieId_key`(`movieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moiveName` VARCHAR(255) NOT NULL,
    `producedYear` INTEGER NOT NULL,
    `director` VARCHAR(255) NOT NULL,
    `posterPath` VARCHAR(191) NOT NULL,
    `tmdbId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Movie_tmdbId_key`(`tmdbId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `auth0Id` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NULL,
    `selfIntroduction` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_auth0Id_key`(`auth0Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovieReview` ADD CONSTRAINT `MovieReview_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovieReview` ADD CONSTRAINT `MovieReview_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
