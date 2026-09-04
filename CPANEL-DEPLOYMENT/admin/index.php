<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Admin Lead Management Dashboard
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

// Generate CSRF token if not set
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf_token'];

$notice = null;
$error = null;
$pdo = null;

try {
    $pdo = get_db_connection();
} catch (Exception $e) {
    $error = 'Database Connection Error. Please verify api/config.php credentials or run database diagnostic.';
}

// Handle Status, Notes, or Delete Actions with CSRF Protection
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    $submittedCsrf = $_POST['csrf_token'] ?? '';
    
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $submittedCsrf)) {
        $error = 'Security verification failed (invalid CSRF token). Please refresh and try again.';
    } else {
        $action = $_POST['action'] ?? '';
        $leadId = trim($_POST['lead_id'] ?? '');

        if ($action === 'update_status' && !empty($leadId)) {
            $newStatus = trim($_POST['status'] ?? 'New');
            $validStatuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'];
            if (in_array($newStatus, $validStatuses, true)) {
                $stmt = $pdo->prepare('UPDATE leads SET status = :status, updated_at = NOW() WHERE id = :id');
                $stmt->execute([':status' => $newStatus, ':id' => $leadId]);
                $notice = "Lead {$leadId} status updated to \"{$newStatus}\".";
            }
        } elseif ($action === 'update_notes' && !empty($leadId)) {
            $notes = trim($_POST['notes'] ?? '');
            $stmt = $pdo->prepare('UPDATE leads SET notes = :notes, updated_at = NOW() WHERE id = :id');
            $stmt->execute([':notes' => $notes, ':id' => $leadId]);
            $notice = "Notes saved for lead {$leadId}.";
        } elseif ($action === 'delete_lead' && !empty($leadId)) {
            $stmt = $pdo->prepare('DELETE FROM leads WHERE id = :id');
            $stmt->execute([':id' => $leadId]);
            $notice = "Lead {$leadId} was permanently deleted.";
        }
    }
}

// Current Filter & Search State
$statusFilter = trim($_GET['status'] ?? 'All');
$searchQuery = trim($_GET['search'] ?? '');

// Fetch Stats
$stats = [
    'total'       => 0,
    'new'         => 0,
    'today'       => 0,
    'this_week'   => 0,
    'contacted'   => 0,
    'in_progress' => 0,
    'completed'   => 0,
    'cancelled'   => 0,
];

$leads = [];

if ($pdo) {
    try {
        $statsStmt = $pdo->query('
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = "New" THEN 1 ELSE 0 END) as count_new,
                SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as count_today,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as count_this_week,
                SUM(CASE WHEN status = "Contacted" THEN 1 ELSE 0 END) as count_contacted,
                SUM(CASE WHEN status = "In Progress" THEN 1 ELSE 0 END) as count_in_progress,
                SUM(CASE WHEN status = "Completed" THEN 1 ELSE 0 END) as count_completed,
                SUM(CASE WHEN status = "Cancelled" THEN 1 ELSE 0 END) as count_cancelled
            FROM leads
        ');
        $statsRow = $statsStmt->fetch();
        if ($statsRow) {
            $stats['total']       = (int)($statsRow['total'] ?? 0);
            $stats['new']         = (int)($statsRow['count_new'] ?? 0);
            $stats['today']       = (int)($statsRow['count_today'] ?? 0);
            $stats['this_week']   = (int)($statsRow['count_this_week'] ?? 0);
            $stats['contacted']   = (int)($statsRow['count_contacted'] ?? 0);
            $stats['in_progress'] = (int)($statsRow['count_in_progress'] ?? 0);
            $stats['completed']   = (int)($statsRow['count_completed'] ?? 0);
            $stats['cancelled']   = (int)($statsRow['count_cancelled'] ?? 0);
        }

        // Build query for leads list with parameterized filters
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

        $sql .= ' ORDER BY created_at DESC LIMIT 200';

        $leadsStmt = $pdo->prepare($sql);
        $leadsStmt->execute($params);
        $leads = $leadsStmt->fetchAll();

    } catch (Exception $ex) {
        $error = 'Query Error. Please check database tables.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FridgeFix Hyderabad - Admin Lead Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="admin-header">
        <div class="brand">
            <div class="brand-logo">FF</div>
            <div>
                <h1>FridgeFix Hyderabad</h1>
                <p>Doorstep Refrigerator &amp; Appliance Service Dispatch</p>
            </div>
        </div>

        <div class="header-actions">
            <span class="user-badge">Signed in as <strong><?= htmlspecialchars($_SESSION['admin_username']) ?></strong></span>
            <a href="/" target="_blank" class="btn-logout" style="background: rgba(255,255,255,0.15);" title="Open Live Website">View Website ↗</a>
            <a href="logout.php" class="btn-logout">Logout</a>
        </div>
    </header>

    <div class="admin-container">

        <!-- Flash Notices -->
        <?php if ($notice): ?>
            <div style="background:#ecfdf5; color:#065f46; padding:12px 16px; border-radius:8px; margin-bottom:20px; border:1px solid #a7f3d0; font-weight:500;">
                <?= htmlspecialchars($notice) ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div style="background:#fee2e2; color:#991b1b; padding:14px 18px; border-radius:8px; margin-bottom:20px; border:1px solid #fecaca;">
                <strong>Notice:</strong> <?= htmlspecialchars($error) ?><br>
                <span style="font-size:12px; opacity:0.9;">Run <a href="/api/test-db.php" target="_blank" style="color:#b91c1c; text-decoration:underline;">Database Diagnostic</a> to check MySQL credentials.</span>
            </div>
        <?php endif; ?>

        <!-- Statistics Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-title">Total Leads</div>
                <div class="stat-value"><?= $stats['total'] ?></div>
            </div>
            <div class="stat-card new">
                <div class="stat-title">⚡ New Leads</div>
                <div class="stat-value"><?= $stats['new'] ?></div>
            </div>
            <div class="stat-card contacted">
                <div class="stat-title">📅 Today's Leads</div>
                <div class="stat-value"><?= $stats['today'] ?></div>
            </div>
            <div class="stat-card in-progress">
                <div class="stat-title">📊 This Week's Leads</div>
                <div class="stat-value"><?= $stats['this_week'] ?></div>
            </div>
        </div>

        <!-- Filter, Search & Export Bar -->
        <div class="controls-bar">
            <div class="filter-tabs">
                <a href="index.php?status=All<?= !empty($searchQuery) ? '&search=' . urlencode($searchQuery) : '' ?>" 
                   class="filter-tab <?= $statusFilter === 'All' ? 'active' : '' ?>">
                   All (<?= $stats['total'] ?>)
                </a>
                <a href="index.php?status=New<?= !empty($searchQuery) ? '&search=' . urlencode($searchQuery) : '' ?>" 
                   class="filter-tab <?= $statusFilter === 'New' ? 'active' : '' ?>">
                   New (<?= $stats['new'] ?>)
                </a>
                <a href="index.php?status=Contacted<?= !empty($searchQuery) ? '&search=' . urlencode($searchQuery) : '' ?>" 
                   class="filter-tab <?= $statusFilter === 'Contacted' ? 'active' : '' ?>">
                   Contacted (<?= $stats['contacted'] ?>)
                </a>
                <a href="index.php?status=In Progress<?= !empty($searchQuery) ? '&search=' . urlencode($searchQuery) : '' ?>" 
                   class="filter-tab <?= $statusFilter === 'In Progress' ? 'active' : '' ?>">
                   In Progress (<?= $stats['in_progress'] ?>)
                </a>
                <a href="index.php?status=Completed<?= !empty($searchQuery) ? '&search=' . urlencode($searchQuery) : '' ?>" 
                   class="filter-tab <?= $statusFilter === 'Completed' ? 'active' : '' ?>">
                   Completed (<?= $stats['completed'] ?>)
                </a>
                <a href="index.php?status=Cancelled<?= !empty($searchQuery) ? '&search=' . urlencode($searchQuery) : '' ?>" 
                   class="filter-tab <?= $statusFilter === 'Cancelled' ? 'active' : '' ?>">
                   Cancelled (<?= $stats['cancelled'] ?>)
                </a>
            </div>

            <div class="search-export">
                <form method="GET" action="index.php" style="display:flex; gap:6px;">
                    <input type="hidden" name="status" value="<?= htmlspecialchars($statusFilter) ?>">
                    <input type="text" name="search" class="search-input" placeholder="Search name, phone, area..." value="<?= htmlspecialchars($searchQuery) ?>">
                    <button type="submit" class="btn-action btn-secondary">Search</button>
                    <?php if (!empty($searchQuery)): ?>
                        <a href="index.php?status=<?= urlencode($statusFilter) ?>" class="btn-action btn-secondary" title="Clear Search">✕</a>
                    <?php endif; ?>
                </form>

                <a href="export-csv.php?status=<?= urlencode($statusFilter) ?>&search=<?= urlencode($searchQuery) ?>" class="btn-action">
                    📥 Export CSV
                </a>
            </div>
        </div>

        <!-- Leads Table -->
        <div class="table-card">
            <?php if (empty($leads)): ?>
                <div class="empty-state">
                    <h3>No customer leads found</h3>
                    <p style="margin-top: 6px;">
                        <?= !empty($searchQuery) ? 'No leads matched your search "' . htmlspecialchars($searchQuery) . '".' : 'No enquiries received for the selected filter.' ?>
                    </p>
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="leads-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Service</th>
                                <th>Location</th>
                                <th>Problem</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($leads as $lead): ?>
                                <?php
                                $cleanPhone = preg_replace('/[^0-9]/', '', $lead['phone'] ?? '');
                                $createdTime = !empty($lead['created_at']) ? date('d M Y, h:i A', strtotime($lead['created_at'])) : 'N/A';
                                $badgeClass = 'badge-' . str_replace(' ', '', $lead['status'] ?? 'New');
                                ?>
                                <tr>
                                    <td>
                                        <strong><?= htmlspecialchars($lead['name']) ?></strong><br>
                                        <span style="color:#0788C9; font-size:11px; font-weight:600;"><?= htmlspecialchars($lead['id']) ?></span>
                                    </td>
                                    <td>
                                        <a href="tel:<?= $cleanPhone ?>" style="color:#0788C9; font-weight:700; text-decoration:none; font-size:13px;">
                                            <?= htmlspecialchars($lead['phone']) ?>
                                        </a>
                                        <div style="margin-top:4px; display:flex; gap:4px;">
                                            <a href="tel:<?= $cleanPhone ?>" class="btn-call" style="font-size:10px; padding:2px 6px;">📞 Call</a>
                                            <a href="https://wa.me/91<?= $cleanPhone ?>?text=Hello%20<?= urlencode($lead['name']) ?>%2C%20this%20is%20FridgeFix%20Hyderabad%20regarding%20your%20service%20booking%20(<?= urlencode($lead['id']) ?>)." target="_blank" class="btn-wa" style="font-size:10px; padding:2px 6px;">💬 WA</a>
                                        </div>
                                    </td>
                                    <td>
                                        <?php if (!empty($lead['email'])): ?>
                                            <a href="mailto:<?= htmlspecialchars($lead['email']) ?>" style="color:#475569; text-decoration:none; font-size:12px;">
                                                <?= htmlspecialchars($lead['email']) ?>
                                            </a>
                                        <?php else: ?>
                                            <span style="color:#94a3b8; font-size:12px;">—</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <strong><?= htmlspecialchars($lead['service']) ?></strong><br>
                                        <span style="font-size:11px; color:#64748b;">
                                            <?= htmlspecialchars($lead['brand'] ?? 'Any Brand') ?> • <?= htmlspecialchars($lead['appliance'] ?? 'Refrigerator') ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span style="color:#0f172a; font-weight:600;"><?= htmlspecialchars($lead['location']) ?></span>
                                        <?php if (!empty($lead['preferred_date'])): ?>
                                            <br><span style="font-size:11px; color:#64748b;">Pref: <?= htmlspecialchars($lead['preferred_date']) ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td style="max-width:200px;">
                                        <div style="font-size:12px; color:#334155; line-height:1.4;">
                                            <?= htmlspecialchars($lead['problem'] ?? 'Standard Inspection') ?>
                                        </div>
                                        <?php if (!empty($lead['message'])): ?>
                                            <div style="font-size:11px; color:#64748b; margin-top:2px; font-style:italic;">
                                                <?= htmlspecialchars($lead['message']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span style="color:#475569; font-size:12px; white-space:nowrap;"><?= $createdTime ?></span>
                                    </td>
                                    <td>
                                        <form method="POST" action="index.php" style="display:flex; flex-direction:column; gap:4px;">
                                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                                            <input type="hidden" name="action" value="update_status">
                                            <input type="hidden" name="lead_id" value="<?= htmlspecialchars($lead['id']) ?>">
                                            <select name="status" class="status-select" onchange="this.form.submit()">
                                                <option value="New" <?= $lead['status'] === 'New' ? 'selected' : '' ?>>New</option>
                                                <option value="Contacted" <?= $lead['status'] === 'Contacted' ? 'selected' : '' ?>>Contacted</option>
                                                <option value="In Progress" <?= $lead['status'] === 'In Progress' ? 'selected' : '' ?>>In Progress</option>
                                                <option value="Completed" <?= $lead['status'] === 'Completed' ? 'selected' : '' ?>>Completed</option>
                                                <option value="Cancelled" <?= $lead['status'] === 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                            </select>
                                            <span class="badge <?= $badgeClass ?>"><?= htmlspecialchars($lead['status']) ?></span>
                                        </form>
                                    </td>
                                    <td>
                                        <form method="POST" action="index.php" onsubmit="return confirm('Are you sure you want to delete lead <?= htmlspecialchars($lead['id']) ?>?');">
                                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                                            <input type="hidden" name="action" value="delete_lead">
                                            <input type="hidden" name="lead_id" value="<?= htmlspecialchars($lead['id']) ?>">
                                            <button type="submit" style="background:none; border:none; color:#ef4444; font-size:11px; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Delete Lead">
                                                🗑️ Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>

        <!-- Footer Diagnostic & Config Information -->
        <div style="margin-top:24px; padding:16px; background:#fff; border-radius:12px; border:1px solid #e2e8f0; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; font-size:12px; color:#64748b;">
            <div>
                <strong>Server Host:</strong> <?= htmlspecialchars($_SERVER['HTTP_HOST'] ?? 'localhost') ?> &bull; 
                <strong>Notification Target:</strong> <code><?= htmlspecialchars(LEAD_RECIPIENT_EMAIL) ?></code> &bull; 
                <strong>Database:</strong> <?= htmlspecialchars(DB_NAME) ?>
            </div>
            <div style="display:flex; gap:12px;">
                <a href="/api/test-db.php" target="_blank" style="color:#0788C9; text-decoration:none; font-weight:600;">Test Database ↗</a>
                <a href="/api/test-email.php" target="_blank" style="color:#0788C9; text-decoration:none; font-weight:600;">Test Email Delivery ↗</a>
            </div>
        </div>

    </div>

</body>
</html>
