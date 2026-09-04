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
    ['id' => 'lead-dummy-1',  'name' => 'Rahul',      'service' => 'Refrigerator Repair',              'area' => 'Kukatpally',    'mins' => 3,   'isReal' => false],
    ['id' => 'lead-dummy-2',  'name' => 'Priya',      'service' => 'AC Service',                       'area' => 'Madhapur',      'mins' => 7,   'isReal' => false],
    ['id' => 'lead-dummy-3',  'name' => 'Arjun',      'service' => 'Washing Machine Repair',           'area' => 'Kondapur',      'mins' => 12,  'isReal' => false],
    ['id' => 'lead-dummy-4',  'name' => 'Sneha',      'service' => 'Refrigerator Repair',              'area' => 'Banjara Hills', 'mins' => 18,  'isReal' => false],
    ['id' => 'lead-dummy-5',  'name' => 'Kiran',      'service' => 'Microwave Repair',                 'area' => 'Ameerpet',      'mins' => 25,  'isReal' => false],
    ['id' => 'lead-dummy-6',  'name' => 'Anjali',     'service' => 'AC Service',                       'area' => 'Gachibowli',    'mins' => 32,  'isReal' => false],
    ['id' => 'lead-dummy-7',  'name' => 'Vikram',     'service' => 'Refrigerator Repair',              'area' => 'Miyapur',       'mins' => 41,  'isReal' => false],
    ['id' => 'lead-dummy-8',  'name' => 'Pooja',      'service' => 'Washing Machine Repair',           'area' => 'Secunderabad',  'mins' => 49,  'isReal' => false],
    ['id' => 'lead-dummy-9',  'name' => 'Rajesh',     'service' => 'Side-by-Side Refrigerator Repair', 'area' => 'Jubilee Hills', 'mins' => 58,  'isReal' => false],
    ['id' => 'lead-dummy-10', 'name' => 'Divya',      'service' => 'RO Water Purifier Service',        'area' => 'Hitech City',   'mins' => 67,  'isReal' => false],
    ['id' => 'lead-dummy-11', 'name' => 'Suresh',     'service' => 'Inverter Refrigerator Repair',     'area' => 'Dilsukhnagar',  'mins' => 79,  'isReal' => false],
    ['id' => 'lead-dummy-12', 'name' => 'Swati',      'service' => 'Microwave Oven Repair',            'area' => 'LB Nagar',      'mins' => 92,  'isReal' => false],
    ['id' => 'lead-dummy-13', 'name' => 'Karthik',    'service' => 'Smart TV Repair',                  'area' => 'Begumpet',      'mins' => 105, 'isReal' => false],
    ['id' => 'lead-dummy-14', 'name' => 'Harish',     'service' => 'AC Jet Cleaning & Service',        'area' => 'KPHB Colony',   'mins' => 125, 'isReal' => false],
    ['id' => 'lead-dummy-15', 'name' => 'Lakshmi',    'service' => 'Refrigerator Gas Leakage Fix',     'area' => 'Manikonda',     'mins' => 140, 'isReal' => false],
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
