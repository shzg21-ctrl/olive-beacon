CREATE TABLE `artworkApprovals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`orderId` int,
	`version` varchar(64) NOT NULL,
	`fileKey` varchar(1024),
	`status` enum('draft','sent','approved','changes_requested') NOT NULL DEFAULT 'draft',
	`customerComments` text,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artworkApprovals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`businessType` varchar(160),
	`primaryContact` varchar(255),
	`email` varchar(320),
	`phone` varchar(64),
	`websiteUrl` varchar(1024),
	`status` enum('prospect','active','inactive') NOT NULL DEFAULT 'prospect',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionType` enum('quote','contact') NOT NULL,
	`businessName` varchar(255),
	`businessType` varchar(160),
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`town` varchar(160),
	`postcode` varchar(32),
	`websiteUrl` varchar(1024),
	`serviceInterests` json NOT NULL,
	`productQuantity` varchar(64),
	`locationCount` varchar(32),
	`installationRequired` varchar(32),
	`currentReviewPlatform` varchar(160),
	`preferredReviewDestination` varchar(1024),
	`contactPreference` varchar(32),
	`subject` varchar(180),
	`message` text NOT NULL,
	`websiteDetails` json,
	`sourcePage` varchar(160) NOT NULL,
	`leadStatus` enum('new','contacted','qualified','quote_sent','follow_up','won','lost') NOT NULL DEFAULT 'new',
	`followUpAt` timestamp,
	`ownerNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`quoteRequestId` int,
	`productName` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`quotedPrice` varchar(64),
	`status` enum('draft','confirmed','in_production','quality_check','fulfilled','cancelled') NOT NULL DEFAULT 'draft',
	`deliveryDetails` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quoteRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`customerId` int,
	`serviceInterests` json NOT NULL,
	`productQuantity` varchar(64),
	`requirements` text,
	`websiteDetails` json,
	`status` enum('new','in_review','quoted','accepted','declined') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quoteRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `websiteProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`quoteRequestId` int,
	`scope` text,
	`status` enum('discovery','design','build','review','launched','maintenance') NOT NULL DEFAULT 'discovery',
	`assetManifest` json,
	`targetDeadline` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `websiteProjects_id` PRIMARY KEY(`id`)
);
