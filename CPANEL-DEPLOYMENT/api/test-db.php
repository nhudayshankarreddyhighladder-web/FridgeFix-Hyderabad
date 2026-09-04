<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Database Connection Diagnostic Tool
 * ====================================================================
 * Route: GET /api/test-db.php
 * 
 * SECURITY NOTICE:
 * This tool is intended for setup verification only.
 * Delete or rename this file after confirming production deployment.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pageTitle = "FridgeFix Database Diagnostic";
$connected = false;
$errorMessage = null;
$tableStats = [];
$tablesExist = false;

try {
    $pdo = get_db_connection();
    $connected = true;

    // Verify leads table
    $stmt = $pdo->query("SHOW TABLES LIKE 'leads'");
    $leadsTable = $stmt->fetch();

    // Verify admin_users table
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    $adminTable = $stmt->fetch();

    $tablesExist = ($leadsTable && $adminTable);

    if ($tablesExist) {
        $countStmt = $pdo->query("SELECT COUNT(*) AS total FROM leads");
        $tableStats['leads_total'] = $countStmt->fetchColumn();

        $adminCountStmt = $pdo->query("SELECT COUNT(*) AS total FROM admin_users");
        $tableStats['admin_total'] = $adminCountStmt->fetchColumn();
    }
} catch (Exception $e) {
    // Sanitize error message to prevent leaking credentials in raw driver traces
    $errorMessage = 'Database connection failed. Please verify DB_NAME, DB_USER, and DB_PASS in api/config.php.';
    error_log('[Diagnostic DB Error]: ' . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px 16px; margin: 0; }
        .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #0788C9; color: #fff; padding: 20px 24px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 24px; }
        .banner { padding: 14px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; font-size: 14px; }
        .banner-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .banner-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .banner-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        td.label { font-weight: 600; color: #64748b; width: 40%; }
        td.value { font-family: monospace; color: #0f172a; }
        .btn { display: inline-block; background: #0788C9; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>FridgeFix Hyderabad</h1>
            <p>Database Diagnostic &amp; Health Check</p>
        </div>
        <div class="content">
            <!-- Security Warning -->
            <div class="banner banner-warning">
                ⚠️ <strong>Security Notice:</strong> This diagnostic tool is intended for initial setup verification only. For security best practices, please delete or rename this file (<code>api/test-db.php</code>) once your deployment is confirmed.
            </div>

            <?php if ($connected && $tablesExist): ?>
                <div class="banner banner-success">
                    ✅ <strong>Database Connected Successfully!</strong><br>
                    MySQL connection is active and both required tables (<code>leads</code>, <code>admin_users</code>) are ready.
                </div>
            <?php elseif ($connected && !$tablesExist): ?>
                <div class="banner banner-warning">
                    ⚠️ <strong>Database Connected, But Tables Missing!</strong><br>
                    Please import <code>database/database.sql</code> using cPanel phpMyAdmin to create the required schema.
                </div>
            <?php else: ?>
                <div class="banner banner-error">
                    ❌ <strong>Database Connection Failed!</strong><br>
                    <?= htmlspecialchars($errorMessage) ?>
                </div>
            <?php endif; ?>

            <h3>Current Configuration (from api/config.php)</h3>
            <table>
                <tr>
                    <td class="label">DB Host:</td>
                    <td class="value"><?= htmlspecialchars(DB_HOST) ?>:<?= htmlspecialchars(DB_PORT) ?></td>
                </tr>
                <tr>
                    <td class="label">DB Name:</td>
                    <td class="value"><?= htmlspecialchars(DB_NAME) ?></td>
                </tr>
                <tr>
                    <td class="label">DB User:</td>
                    <td class="value"><?= htmlspecialchars(DB_USER) ?></td>
                </tr>
                <tr>
                    <td class="label">DB Password:</td>
                    <td class="value">•••••••• (Protected)</td>
                </tr>
                <tr>
                    <td class="label">Charset:</td>
                    <td class="value"><?= htmlspecialchars(DB_CHARSET) ?></td>
                </tr>
                <?php if ($connected && $tablesExist): ?>
                <tr>
                    <td class="label">Total Leads Stored:</td>
                    <td class="value"><strong><?= htmlspecialchars($tableStats['leads_total']) ?> records</strong></td>
                </tr>
                <tr>
                    <td class="label">Admin Users Stored:</td>
                    <td class="value"><strong><?= htmlspecialchars($tableStats['admin_total']) ?> user(s)</strong></td>
                </tr>
                <?php endif; ?>
            </table>

            <div style="display:flex; gap:10px; margin-top:20px;">
                <a href="/admin/login.php" class="btn">Go to Admin Login &rarr;</a>
                <a href="/api/test-email.php" class="btn" style="background:#475569;">Test Email Delivery &rarr;</a>
            </div>
        </div>
    </div>
</body>
</html>
