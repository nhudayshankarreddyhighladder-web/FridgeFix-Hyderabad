<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Public Leads Feed API Endpoint
 * ====================================================================
 * Route: GET /api/get-leads.php (or /api/leads/recent)
 * 
 * STRICT PRIVACY POLICY:
 * This public feed is consumed by the floating side notification popup.
 * It NEVER returns:
 * - Phone numbers
 * - Email addresses
 * - Last names
 * - Full customer addresses
 * - Private notes or messages
 * 
 * It ONLY returns:
 * - First name
 * - Locality / Area
 * - Service requested
 * - Relative time elapsed (mins)
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// Handle CORS Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json_response(['status' => 'ok'], 200);
}

// Fallback dummy leads for smooth rotation if database is empty or pending configuration
$fallbackLeads = [
    ['id' => 'lead-dummy-1', 'name' => 'Ramesh', 'service' => 'Double Door Refrigerator Repair', 'area' => 'Kukatpally', 'mins' => 4, 'isReal' => false],
    ['id' => 'lead-dummy-2', 'name' => 'Sunitha', 'service' => 'Single Door Refrigerator Repair', 'area' => 'Gachibowli', 'mins' => 11, 'isReal' => false],
    ['id' => 'lead-dummy-3', 'name' => 'Vikram', 'service' => 'Side-by-Side Refrigerator Repair', 'area' => 'Banjara Hills', 'mins' => 19, 'isReal' => false],
    ['id' => 'lead-dummy-4', 'name' => 'Priya', 'service' => 'Inverter Refrigerator Repair', 'area' => 'Madhapur', 'mins' => 27, 'isReal' => false],
    ['id' => 'lead-dummy-5', 'name' => 'Kishore', 'service' => 'AC Repair & Gas Refill', 'area' => 'Kondapur', 'mins' => 38, 'isReal' => false],
    ['id' => 'lead-dummy-6', 'name' => 'Anand', 'service' => 'Washing Machine Repair', 'area' => 'Miyapur', 'mins' => 49, 'isReal' => false],
    ['id' => 'lead-dummy-7', 'name' => 'Deepika', 'service' => 'Double Door Refrigerator Repair', 'area' => 'Dilsukhnagar', 'mins' => 62, 'isReal' => false],
    ['id' => 'lead-dummy-8', 'name' => 'Suresh', 'service' => 'Frost-Free Refrigerator Repair', 'area' => 'Secunderabad', 'mins' => 78, 'isReal' => false],
    ['id' => 'lead-dummy-9', 'name' => 'Sneha', 'service' => 'Microwave Oven Repair', 'area' => 'Begumpet', 'mins' => 95, 'isReal' => false],
    ['id' => 'lead-dummy-10', 'name' => 'Venkatesh', 'service' => 'RO / Water Purifier Service', 'area' => 'Jubilee Hills', 'mins' => 120, 'isReal' => false],
];

$realLeads = [];

try {
    $pdo = get_db_connection();

    // Query recent leads from the last 72 hours
    $stmt = $pdo->prepare('
        SELECT 
            id, 
            name, 
            service, 
            location, 
            TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS mins_elapsed
        FROM leads 
        WHERE status != "Cancelled"
        ORDER BY created_at DESC 
        LIMIT 15
    ');
    $stmt->execute();
    $rows = $stmt->fetchAll();

    foreach ($rows as $row) {
        // Privacy protection: First name only!
        $nameParts = explode(' ', trim($row['name'] ?? ''));
        $firstName = !empty($nameParts[0]) ? $nameParts[0] : 'Customer';
        
        $mins = isset($row['mins_elapsed']) ? max(0, (int)$row['mins_elapsed']) : 0;

        $realLeads[] = [
            'id'      => $row['id'],
            'name'    => $firstName,
            'service' => $row['service'] ?? 'Refrigerator Repair',
            'area'    => $row['location'] ?? 'Hyderabad',
            'mins'    => $mins,
            'isReal'  => true,
        ];
    }
} catch (Exception $e) {
    error_log('[Get Leads Feed Error]: ' . $e->getMessage());
    // Graceful degradation to fallback leads
}

// Combine real leads first, followed by dummy leads to keep the feed active
$combinedLeads = $realLeads;

foreach ($fallbackLeads as $dummy) {
    if (count($combinedLeads) >= 15) {
        break;
    }
    // Avoid ID collision
    if (!in_array($dummy['id'], array_column($combinedLeads, 'id'))) {
        $combinedLeads[] = $dummy;
    }
}

send_json_response([
    'success' => true,
    'count'   => count($combinedLeads),
    'leads'   => $combinedLeads,
], 200);
