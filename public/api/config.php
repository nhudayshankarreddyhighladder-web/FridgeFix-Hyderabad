<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Production API & Database Configuration
 * ====================================================================
 * 
 * Update this file with your cPanel MySQL and Mail settings.
 * 
 * Quick Guide:
 * 1. Create a MySQL Database and User in cPanel > MySQL Database Wizard.
 * 2. Assign the user to the database with ALL PRIVILEGES.
 * 3. Import database/database.sql in phpMyAdmin.
 * 4. Fill in DB_NAME, DB_USER, and DB_PASS below.
 */

// Prevent direct script execution from browser if requested directly
if (basename($_SERVER['PHP_SELF']) === 'config.php') {
    http_response_code(403);
    die(json_encode(['error' => 'Direct access forbidden.']));
}

// Environment mode ('development' or 'production')
define('APP_ENV', 'production');

// Error reporting settings
if (APP_ENV === 'development') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

// Timezone (Indian Standard Time)
date_default_timezone_set('Asia/Kolkata');

// ====================================================================
// 1. DATABASE CONFIGURATION (cPanel MySQL)
// ====================================================================
// Note: In cPanel, DB_NAME and DB_USER are typically prefixed with your cPanel username,
// e.g., 'youruser_fridgefix'
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'fridgefix_db');
define('DB_USER', getenv('DB_USER') ?: 'fridgefix_user');
define('DB_PASS', getenv('DB_PASS') ?: 'YourStrongPasswordHere');
define('DB_CHARSET', 'utf8mb4');

// ====================================================================
// 2. LEAD NOTIFICATION & EMAIL CONFIGURATION
// ====================================================================
// Where service bookings and customer enquiries are delivered
define('LEAD_RECIPIENT_EMAIL', getenv('LEAD_RECIPIENT_EMAIL') ?: 'Coolcomfortsolutions13@gmail.com');
define('LEAD_RECIPIENT_NAME', 'FridgeFix Dispatch');

// Sender identity
define('MAIL_FROM_NAME', 'FridgeFix Hyderabad');
define('MAIL_FROM_EMAIL', getenv('MAIL_FROM_EMAIL') ?: ('no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'fridgefixhyderabad.com')));

// Mail delivery method: 'mail' (standard PHP mail() in cPanel) or 'smtp'
define('MAIL_METHOD', getenv('MAIL_METHOD') ?: 'mail');

// SMTP Settings (Optional - required only if MAIL_METHOD is set to 'smtp')
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'mail.yourdomain.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 465); // 465 for SSL, 587 for TLS
define('SMTP_USER', getenv('SMTP_USER') ?: 'notifications@yourdomain.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');
define('SMTP_SECURE', getenv('SMTP_SECURE') ?: 'ssl'); // 'ssl' or 'tls'

// ====================================================================
// 3. SECURITY & ANTI-SPAM SETTINGS
// ====================================================================
// Minimum seconds between submissions for the same phone number
define('RATE_LIMIT_SECONDS', 30);

// Anti-spam honeypot input field name
define('HONEYPOT_FIELD', 'botField');

// CORS Allowed Origins (Set '*' or your domain 'https://yourdomain.com')
define('CORS_ALLOWED_ORIGIN', '*');

// Admin session security key
define('SESSION_NAME', 'ff_admin_session');
define('SESSION_LIFETIME', 86400 * 7); // 7 days

// Helper function to send standard JSON responses
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . CORS_ALLOWED_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
