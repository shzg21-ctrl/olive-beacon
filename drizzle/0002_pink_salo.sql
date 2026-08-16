CREATE TABLE `customerAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`onboardingId` int NOT NULL,
	`category` varchar(64) NOT NULL,
	`originalName` varchar(160) NOT NULL,
	`storageKey` varchar(1024) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`byteSize` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customerAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customerOnboardings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inviteId` int NOT NULL,
	`customerId` int,
	`businessDetails` json NOT NULL,
	`productDetails` json NOT NULL,
	`reviewDestination` json NOT NULL,
	`brandingDetails` json NOT NULL,
	`deliveryDetails` json NOT NULL,
	`websiteProjectDetails` json NOT NULL,
	`accurateConfirmed` boolean NOT NULL,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerOnboardings_id` PRIMARY KEY(`id`),
	CONSTRAINT `customerOnboardings_inviteId_unique` UNIQUE(`inviteId`)
);
--> statement-breakpoint
CREATE TABLE `onboardingInvites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`leadId` int,
	`customerId` int,
	`quoteRequestId` int,
	`artworkApprovalId` int,
	`status` enum('active','completed','revoked') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onboardingInvites_id` PRIMARY KEY(`id`),
	CONSTRAINT `onboardingInvites_tokenHash_unique` UNIQUE(`tokenHash`)
);
