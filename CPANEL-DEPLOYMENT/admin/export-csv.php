<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Export Leads to CSV
 * ====================================================================
 */

require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/db.php';

session_name(SESSION_NAME);
session_start();

if (empty($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

$statusFilter = trim($_GET['status'] ?? 'All');
$searchQuery = trim($_GET['search'] ?? '');

try {
    $pdo = get_db_connection();

    $sql = 'SELECT * FROM leads WHERE 1=1';
    $params = [];

    if ($statusFilter !== 'All') {
        $sql .= ' AND status = :status';
        $params[':status'] = $statusFilter;
    }

    if (!empty($searchQuery)) {
        $sql .= ' AND (name LIKE :q OR phone LIKE :q OR location LIKE :q OR service LIKE :q OR id LIKE :q)';
        $params[':q'] = "%{$searchQuery}%";
    }

    $sql .= ' ORDER BY created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $leads = $stmt->fetchAll();

    $filename = 'fridgefix_leads_' . date('Y-m-d_His') . '.csv';

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');

    $output = fopen('php://output', 'w');

    // Add UTF-8 BOM for Microsoft Excel compatibility
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

    // CSV Header row
    fputcsv($output, [
        'Lead ID',
        'Customer Name',
        'Mobile Phone',
        'Email Address',
        'Service Required',
        'Appliance',
        'Brand',
        'Location / Area',
        'Preferred Timing',
        'Problem Description',
        'Status',
        'Source Page',
        'Date & Time (IST)',
        'Internal Notes'
    ]);

    foreach ($leads as $l) {
        fputcsv($output, [
            $l['id'] ?? '',
            $l['name'] ?? '',
            $l['phone'] ?? '',
            $l['email'] ?? '',
            $l['service'] ?? '',
            $l['appliance'] ?? '',
            $l['brand'] ?? '',
            $l['location'] ?? '',
            $l['preferred_date'] ?? '',
            $l['problem'] ?? '',
            $l['status'] ?? 'New',
            $l['source_page'] ?? '',
            $l['created_at'] ?? '',
            $l['notes'] ?? ''
        ]);
    }

    fclose($output);
    exit;

} catch (Exception $e) {
    die('Error generating CSV export: ' . htmlspecialchars($e->getMessage()));
}
