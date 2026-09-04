<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Production API & Database Configuration
 * ====================================================================
 * 
 * Standard cPanel Shared Hosting Configuration (Apache / PHP / MySQL)
 * 
 * Instructions:
 * 1. Create a MySQL database and user in cPanel > "MySQL® Database Wizard".
 * 2. Assign the user to the database with ALL PRIVILEGES.
 * 3. Import "database/database.sql" in phpMyAdmin.
 * 4. Fill in your DB credentials and SMTP details below.
 */

// Prevent direct script execution if accessed directly from the browser
if (basename($_SERVER['PHP_SELF']) === 'config.php') {
    http_response_code(403);
    die(json_encode(['error' => 'Direct access forbidden.']));
}

// Timezone (Indian Standard Time)
date_default_timezone_set('Asia/Kolkata');

// ====================================================================
// 1. MYSQL DATABASE CONFIGURATION (cPanel MySQL)
// ====================================================================
// Note: In cPanel, DB_NAME and DB_USER are typically prefixed with your cPanel username,
// e.g., 'yourcpaneluser_fridgefix'
define('DB_HOST',     getenv('DB_HOST')     ?: 'localhost');
define('DB_PORT',     getenv('DB_PORT')     ?: '3306');
define('DB_NAME',     getenv('DB_NAME')     ?: 'fridgefix_db');
define('DB_USER',     getenv('DB_USER')     ?: 'fridgefix_user');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: (getenv('DB_PASS') ?: 'YourStrongPasswordHere'));
define('DB_CHARSET',  'utf8mb4');

// Backward compatibility alias
define('DB_PASS', DB_PASSWORD);

// ====================================================================
// 2. LEAD NOTIFICATION RECIPIENT
// ====================================================================
// Every service booking enquiry is delivered directly to this address
define('LEAD_RECIPIENT_EMAIL', 'Coolcomfortsolutions13@gmail.com');
define('LEAD_RECIPIENT_NAME',  'FridgeFix Hyderabad Dispatch');

// ====================================================================
// 3. SMTP & EMAIL CONFIGURATION
// ====================================================================
// Set to 'smtp' for authenticated SMTP (recommended for cPanel Exim/Gmail/Zoho/SendGrid),
// or 'mail' to use standard cPanel internal sendmail/PHP mail()
define('MAIL_METHOD', getenv('MAIL_METHOD') ?: 'smtp');

// Server-side SMTP credentials (Never exposed to frontend JavaScript)
define('SMTP_HOST',       getenv('SMTP_HOST')       ?: 'mail.yourdomain.com');
define('SMTP_PORT',       (int)(getenv('SMTP_PORT') ?: 465)); // 465 for SSL, 587 for TLS
define('SMTP_USERNAME',   getenv('SMTP_USERNAME')   ?: (getenv('SMTP_USER') ?: 'notifications@yourdomain.com'));
define('SMTP_PASSWORD',   getenv('SMTP_PASSWORD')   ?: (getenv('SMTP_PASS') ?: ''));
define('SMTP_ENCRYPTION', getenv('SMTP_ENCRYPTION') ?: (getenv('SMTP_SECURE') ?: 'ssl')); // 'ssl' or 'tls'

// SSL/TLS Certificate Verification (Strict verification enabled by default)
define('SMTP_VERIFY_PEER', getenv('SMTP_VERIFY_PEER') !== false ? filter_var(getenv('SMTP_VERIFY_PEER'), FILTER_VALIDATE_BOOLEAN) : true);

// Sender Details
define('SMTP_FROM_EMAIL', getenv('SMTP_FROM_EMAIL') ?: 'no-reply@fridgefixhyderabad.com');
define('SMTP_FROM_NAME',  getenv('SMTP_FROM_NAME')  ?: 'FridgeFix Hyderabad');

// Backward compatibility aliases
define('SMTP_USER',       SMTP_USERNAME);
define('SMTP_PASS',       SMTP_PASSWORD);
define('SMTP_SECURE',     SMTP_ENCRYPTION);
define('MAIL_FROM_EMAIL', SMTP_FROM_EMAIL);
define('MAIL_FROM_NAME',  SMTP_FROM_NAME);

// ====================================================================
// 4. SECURITY & ANTI-SPAM SETTINGS
// ====================================================================
// Minimum seconds between identical submissions for rate limiting
define('RATE_LIMIT_SECONDS', 30);

// Anti-spam honeypot input field name (must be empty from real humans)
define('HONEYPOT_FIELD', 'botField');

// CORS Allowed Origin
define('CORS_ALLOWED_ORIGIN', '*');

// Admin session configuration
define('SESSION_NAME', 'ff_admin_session');
define('SESSION_LIFETIME', 86400 * 7); // 7 days

/**
 * Helper function to send standard JSON responses with CORS & UTF-8 headers
 */
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . CORS_ALLOWED_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
