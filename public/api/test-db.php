<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - MySQL Connection Diagnostic Tool
 * ====================================================================
 * Route: /api/test-db.php
 * 
 * Use this in your browser to verify that:
 * 1. Your database credentials in api/config.php are correct.
 * 2. The database.sql schema has been imported.
 * 3. The `leads` table exists and is accessible.
 */

require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

$status = [];
$canConnect = false;
$tableExists = false;
$leadCount = 0;
$adminUserExists = false;

try {
    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    $canConnect = true;
    $status[] = '✅ Successfully connected to MySQL server (' . DB_HOST . ')';
    $status[] = '✅ Database "' . DB_NAME . '" selected successfully';

    // Check leads table
    $stmt = $pdo->query("SHOW TABLES LIKE 'leads'");
    if ($stmt->fetch()) {
        $tableExists = true;
        $status[] = '✅ Table `leads` exists in database';

        $countStmt = $pdo->query("SELECT COUNT(*) as total FROM leads");
        $leadCount = $countStmt->fetch()['total'] ?? 0;
        $status[] = "ℹ️ Current total leads in database: <strong>{$leadCount}</strong>";
    } else {
        $status[] = '❌ Table `leads` NOT found! Please import database/database.sql in phpMyAdmin.';
    }

    // Check admin_users table
    $stmtAdmin = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmtAdmin->fetch()) {
        $adminUserExists = true;
        $status[] = '✅ Table `admin_users` exists in database';
    } else {
        $status[] = '⚠️ Table `admin_users` NOT found. Import database/database.sql to create it.';
    }

} catch (PDOException $e) {
    $status[] = '❌ Connection Error: ' . htmlspecialchars($e->getMessage());
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>FridgeFix - Database Diagnostic Test</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 40px 20px; color: #1e293b; }
        .box { max-width: 650px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        h1 { color: #0788C9; margin-top: 0; font-size: 22px; }
        ul { list-style: none; padding: 0; margin: 20px 0; }
        li { padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; font-size: 14px; background: #f1f5f9; }
        .config-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
        .config-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
        .btn { display: inline-block; background: #0788C9; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; margin-top: 15px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="box">
        <h1>FridgeFix Database Diagnostic Check</h1>
        <p>Testing connection parameters from <code>api/config.php</code>:</p>

        <ul>
            <?php foreach ($status as $msg): ?>
                <li><?= $msg ?></li>
            <?php endforeach; ?>
        </ul>

        <h3>Active Configuration:</h3>
        <table class="config-table">
            <tr><td><strong>DB_HOST:</strong></td><td><?= htmlspecialchars(DB_HOST) ?></td></tr>
            <tr><td><strong>DB_NAME:</strong></td><td><?= htmlspecialchars(DB_NAME) ?></td></tr>
            <tr><td><strong>DB_USER:</strong></td><td><?= htmlspecialchars(DB_USER) ?></td></tr>
            <tr><td><strong>DB_PASS:</strong></td><td><?= !empty(DB_PASS) && DB_PASS !== 'YourStrongPasswordHere' ? '•••••••• (Configured)' : '<span style="color:red">Needs update in api/config.php</span>' ?></td></tr>
            <tr><td><strong>Timezone:</strong></td><td><?= date_default_timezone_get() ?> (Current time: <?= date('Y-m-d H:i:s') ?>)</td></tr>
        </table>

        <?php if ($canConnect && $tableExists): ?>
            <p style="color: green; font-weight: bold; margin-top: 20px;">🎉 Everything is correctly configured for cPanel MySQL!</p>
            <a href="/admin/" class="btn">Go to Admin Dashboard &rarr;</a>
        <?php else: ?>
            <p style="color: #b91c1c; font-weight: 500; margin-top: 20px;">Please check <code>api/config.php</code> with your cPanel MySQL details, and make sure <code>database/database.sql</code> was imported via phpMyAdmin.</p>
        <?php endif; ?>
    </div>
</body>
</html>
