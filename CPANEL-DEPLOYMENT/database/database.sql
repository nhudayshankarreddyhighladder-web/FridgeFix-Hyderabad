-- ==========================================================
-- FridgeFix Hyderabad - Production MySQL Database Schema
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.2+
-- Collation: utf8mb4_unicode_ci for full Unicode & Indian names
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30"; -- Indian Standard Time (IST)

-- --------------------------------------------------------
-- Table structure for table `leads`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` varchar(64) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `service` varchar(150) NOT NULL,
  `appliance` varchar(100) DEFAULT 'Refrigerator',
  `brand` varchar(100) DEFAULT NULL,
  `problem` text DEFAULT NULL,
  `location` varchar(150) NOT NULL,
  `preferred_date` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `source_page` varchar(255) DEFAULT '/',
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `status` enum('New','Contacted','In Progress','Completed','Cancelled') NOT NULL DEFAULT 'New',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_created_at` (`created_at`),
  KEY `idx_leads_phone` (`phone`),
  KEY `idx_leads_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `admin_users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `full_name` varchar(100) NOT NULL DEFAULT 'Admin User',
  `role` varchar(50) NOT NULL DEFAULT 'super_admin',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping default data for table `admin_users`
-- Default credentials:
-- Username: admin
-- Password: admin@FridgeFix2025
-- (Change password immediately in the Admin panel after installation!)
-- --------------------------------------------------------
INSERT INTO `admin_users` (`username`, `password_hash`, `email`, `full_name`, `role`, `created_at`) 
VALUES (
  'admin',
  '$2y$10$tZ2R8k0w8eH3R37vU6L9QOD7H3M4u5G4E4n7F6q1I2u8Z7Y9b2K2m', -- Hash for: admin@FridgeFix2025
  'Coolcomfortsolutions13@gmail.com',
  'FridgeFix Manager',
  'super_admin',
  NOW()
)
ON DUPLICATE KEY UPDATE `username` = `username`;

-- --------------------------------------------------------
-- Dumping initial realistic sample leads for Hyderabad
-- (Allows instant testing of the side popup feed and admin table)
-- --------------------------------------------------------
INSERT INTO `leads` (`id`, `name`, `phone`, `email`, `service`, `appliance`, `brand`, `problem`, `location`, `preferred_date`, `message`, `source_page`, `status`, `created_at`) VALUES
('FF-HYD-001', 'Ramesh Reddy', '9848022338', 'ramesh.reddy@gmail.com', 'Double Door Refrigerator Repair', 'Refrigerator', 'LG', 'Not cooling at lower compartment, ice buildup in freezer', 'Kukatpally', 'Today', 'Please send a technician urgently before 5 PM.', '/refrigerator-repair', 'Contacted', DATE_SUB(NOW(), INTERVAL 18 MINUTE)),
('FF-HYD-002', 'Sunitha Sharma', '9989112244', 'sunitha.s@outlook.com', 'Single Door Refrigerator Repair', 'Refrigerator', 'Samsung', 'Water leaking on floor underneath fridge', 'Gachibowli', 'Today Afternoon', 'Freezer is working fine but water leaks underneath.', '/', 'New', DATE_SUB(NOW(), INTERVAL 34 MINUTE)),
('FF-HYD-003', 'Vikram Kumar', '9701884422', 'vikram.k@yahoo.com', 'Side-by-Side Refrigerator Repair', 'Refrigerator', 'Whirlpool', 'Strange humming noise and compressor tripping', 'Banjara Hills', 'Tomorrow Morning', 'High end model, need genuine parts with bill.', '/services/side-by-side-refrigerator-repair', 'In Progress', DATE_SUB(NOW(), INTERVAL 52 MINUTE)),
('FF-HYD-004', 'Priya Rao', '9866337711', 'priya.rao@gmail.com', 'Inverter Refrigerator Repair', 'Refrigerator', 'Godrej', 'Power supply issue, display blinking', 'Madhapur', 'Earliest available', 'Near Cyber Towers.', '/refrigerator-repair', 'New', DATE_SUB(NOW(), INTERVAL 75 MINUTE)),
('FF-HYD-005', 'Kishore Varma', '9440556677', 'kishore.v@gmail.com', 'AC Repair & Gas Refill', 'Air Conditioner', 'Voltas', 'AC blowing warm air, needs gas check', 'Kondapur', 'Today Evening', 'Split AC 1.5 Ton.', '/ac-repair', 'Contacted', DATE_SUB(NOW(), INTERVAL 110 MINUTE)),
('FF-HYD-006', 'Anand Joshi', '9177883300', 'anand.j@gmail.com', 'Washing Machine Repair', 'Washing Machine', 'IFB', 'Drum not spinning during rinse cycle', 'Miyapur', 'Tomorrow', 'Front load 7kg.', '/washing-machine-repair', 'Completed', DATE_SUB(NOW(), INTERVAL 180 MINUTE));

COMMIT;
