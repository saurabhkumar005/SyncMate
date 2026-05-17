-- =========================================
-- SyncMate Database Initial Setup
-- Run this file using ROOT user only
-- =========================================


-- Create Database
CREATE DATABASE IF NOT EXISTS syncmate

DEFAULT CHARACTER SET utf8mb4

DEFAULT COLLATE utf8mb4_unicode_ci;



-- Create Application User
CREATE USER IF NOT EXISTS 'syncmate'@'localhost'

IDENTIFIED BY 'your_password';



-- Grant Permissions
GRANT ALL PRIVILEGES

ON syncmate.*

TO 'syncmate'@'localhost';



-- Reload Privileges
FLUSH PRIVILEGES;



-- Verify User Permissions (Optional)
SHOW GRANTS FOR 'syncmate'@'localhost';