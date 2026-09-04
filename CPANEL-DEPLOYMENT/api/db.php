<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - PDO Database Connection Handler
 * ====================================================================
 */

require_once __DIR__ . '/config.php';

/**
 * Returns a shared PDO database connection instance.
 *
 * @return PDO
 * @throws PDOException
 */
function get_db_connection() {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // In production, log error without exposing credentials
        error_log('[FridgeFix DB Connection Error]: ' . $e->getMessage());

        // Check if called from an API endpoint
        if (php_sapi_name() !== 'cli') {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed. Please check your api/config.php credentials or import database/database.sql into MySQL.',
                'code' => 'DB_CONNECTION_FAILED'
            ]);
            exit;
        }

        throw $e;
    }
}
