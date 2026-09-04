<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Lead Submission API Endpoint
 * ====================================================================
 * Route: POST /api/submit-lead.php (or /api/leads)
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// Handle CORS Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json_response(['status' => 'ok'], 200);
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response([
        'success' => false,
        'error' => 'Method not allowed. Use POST.'
    ], 405);
}

// Read raw JSON body or form POST data
$inputData = [];
$rawInput = file_get_contents('php://input');

if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $inputData = $decoded;
    }
}

if (empty($inputData) && !empty($_POST)) {
    $inputData = $_POST;
}

// -------------------------------------------------------------
// 1. Anti-Spam Honeypot Check
// -------------------------------------------------------------
$botField = trim($inputData[HONEYPOT_FIELD] ?? '');
if (!empty($botField)) {
    // Bot detected: Return fake success to confuse spammer without storing or emailing
    send_json_response([
        'success' => true,
        'message' => 'Thank you. Your service booking enquiry has been received.'
    ], 200);
}

// -------------------------------------------------------------
// 2. Extract & Sanitize Form Inputs
// -------------------------------------------------------------
$name          = trim($inputData['name'] ?? '');
$rawPhone      = trim($inputData['phone'] ?? '');
$email         = trim($inputData['email'] ?? '');
$service       = trim($inputData['service'] ?? '');
$appliance     = trim($inputData['appliance'] ?? 'Refrigerator');
$brand         = trim($inputData['brand'] ?? '');
$problem       = trim($inputData['problem'] ?? '');
$location      = trim($inputData['location'] ?? '');
$preferredDate = trim($inputData['preferredDate'] ?? $inputData['preferred_date'] ?? '');
$message       = trim($inputData['message'] ?? '');
$sourcePage    = trim($inputData['sourcePage'] ?? $inputData['source_page'] ?? '/');

// Client IP & User Agent
$ipAddress = $_SERVER['HTTP_CF_CONNECTING_IP'] 
    ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
    ?? $_SERVER['REMOTE_ADDR'] 
    ?? 'Unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// -------------------------------------------------------------
// 3. Server-Side Validation
// -------------------------------------------------------------
if (mb_strlen($name) < 2) {
    send_json_response([
        'success' => false,
        'error' => 'Please enter your full name (minimum 2 characters).'
    ], 400);
}

// Extract digits only for phone validation
$digitsOnly = preg_replace('/[^0-9]/', '', $rawPhone);
if (strlen($digitsOnly) < 10) {
    send_json_response([
        'success' => false,
        'error' => 'Please enter a valid 10-digit mobile number.'
    ], 400);
}

if (empty($service)) {
    send_json_response([
        'success' => false,
        'error' => 'Please select an appliance or repair service.'
    ], 400);
}

if (empty($location)) {
    send_json_response([
        'success' => false,
        'error' => 'Please select or enter your area in Hyderabad.'
    ], 400);
}

// -------------------------------------------------------------
// 4. Rate Limiting Check (Duplicate submissions within 30s)
// -------------------------------------------------------------
try {
    $pdo = get_db_connection();

    $checkStmt = $pdo->prepare('
        SELECT id, created_at 
        FROM leads 
        WHERE phone = :phone 
          AND service = :service 
          AND created_at >= DATE_SUB(NOW(), INTERVAL :rate_limit SECOND)
        LIMIT 1
    ');
    $checkStmt->bindValue(':phone', $digitsOnly, PDO::PARAM_STR);
    $checkStmt->bindValue(':service', $service, PDO::PARAM_STR);
    $checkStmt->bindValue(':rate_limit', RATE_LIMIT_SECONDS, PDO::PARAM_INT);
    $checkStmt->execute();

    if ($checkStmt->fetch()) {
        send_json_response([
            'success' => false,
            'error' => 'You have recently submitted this enquiry. Our technician team is already reviewing it!'
        ], 429);
    }
} catch (Exception $e) {
    error_log('[Rate Limit Check Error]: ' . $e->getMessage());
    // Continue even if rate check check fails
}

// -------------------------------------------------------------
// 5. Generate Lead ID & Insert into MySQL
// -------------------------------------------------------------
$timestampBase36 = strtoupper(base_convert(time(), 10, 36));
$randomSuffix = strtoupper(substr(bin2hex(random_bytes(2)), 0, 3));
$leadId = 'FF-' . $timestampBase36 . '-' . $randomSuffix;

try {
    $insertStmt = $pdo->prepare('
        INSERT INTO leads (
            id, name, phone, email, service, appliance, brand, 
            problem, location, preferred_date, message, source_page, 
            ip_address, user_agent, status, created_at
        ) VALUES (
            :id, :name, :phone, :email, :service, :appliance, :brand, 
            :problem, :location, :preferred_date, :message, :source_page, 
            :ip_address, :user_agent, :status, NOW()
        )
    ');

    $insertStmt->execute([
        ':id'             => $leadId,
        ':name'           => $name,
        ':phone'          => $digitsOnly,
        ':email'          => !empty($email) ? $email : null,
        ':service'        => $service,
        ':appliance'      => !empty($appliance) ? $appliance : 'Refrigerator',
        ':brand'          => !empty($brand) ? $brand : null,
        ':problem'        => !empty($problem) ? $problem : null,
        ':location'       => $location,
        ':preferred_date' => !empty($preferredDate) ? $preferredDate : null,
        ':message'        => !empty($message) ? $message : null,
        ':source_page'    => $sourcePage,
        ':ip_address'     => substr($ipAddress, 0, 64),
        ':user_agent'     => substr($userAgent, 0, 255),
        ':status'         => 'New',
    ]);
} catch (PDOException $e) {
    error_log('[Lead Insertion Error]: ' . $e->getMessage());
    send_json_response([
        'success' => false,
        'error' => 'Unable to save lead to database. Please call our 24x7 helpline directly at 7416 225 140.'
    ], 500);
}

// -------------------------------------------------------------
// 6. Send Email Notification
// -------------------------------------------------------------
$emailSent = false;
$emailError = null;

$emailSubject = "New Service Lead - FridgeFix Hyderabad ({$location})";
$istTimeFormatted = date('d M Y, h:i A');

// Build HTML email message
$emailHtml = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Service Lead</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: #0788C9; padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.92; }
    .body { padding: 24px; }
    .badge { display: inline-block; background: #ECFDF5; color: #065F46; padding: 5px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 16px; border: 1px solid #a7f3d0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
    td.label { font-weight: bold; color: #64748b; width: 35%; }
    td.value { color: #0f172a; font-weight: 500; }
    .cta-box { margin-top: 24px; padding: 18px; background: #f0f9ff; border-radius: 8px; text-align: center; border: 1px solid #bae6fd; }
    .cta-btn { display: inline-block; background: #0788C9; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 6px; font-weight: bold; font-size: 14px; margin: 4px; }
    .wa-btn { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 6px; font-weight: bold; font-size: 14px; margin: 4px; }
    .footer { padding: 16px 24px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FridgeFix Hyderabad</h1>
      <p>Instant Doorstep Service Enquiry Notification</p>
    </div>
    <div class="body">
      <div class="badge">⚡ New Booking Received • {$leadId}</div>
      <table>
        <tr><td class="label">Customer Name:</td><td class="value"><strong>{$name}</strong></td></tr>
        <tr><td class="label">Mobile Number:</td><td class="value"><a href="tel:{$digitsOnly}" style="color:#0788C9; font-weight:bold; font-size:15px;">{$digitsOnly}</a></td></tr>
        <tr><td class="label">Email Address:</td><td class="value">HTML;

$emailHtml .= (!empty($email) ? "<a href=\"mailto:{$email}\">{$email}</a>" : "Not provided");
$emailHtml .= <<<HTML
</td></tr>
        <tr><td class="label">Service Required:</td><td class="value"><strong>{$service}</strong></td></tr>
        <tr><td class="label">Appliance Type:</td><td class="value">{$appliance}</td></tr>
        <tr><td class="label">Brand:</td><td class="value">HTML;
$emailHtml .= (!empty($brand) ? $brand : "All / Any Brand");
$emailHtml .= <<<HTML
</td></tr>
        <tr><td class="label">Locality / Area:</td><td class="value"><strong>{$location}, Hyderabad</strong></td></tr>
        <tr><td class="label">Preferred Timing:</td><td class="value">HTML;
$emailHtml .= (!empty($preferredDate) ? $preferredDate : "Earliest available slot");
$emailHtml .= <<<HTML
</td></tr>
        <tr><td class="label">Reported Issue:</td><td class="value" style="color:#dc2626;">HTML;
$emailHtml .= (!empty($problem) ? htmlspecialchars($problem) : "Standard Inspection / Service Needed");
$emailHtml .= <<<HTML
</td></tr>
HTML;

if (!empty($message)) {
    $safeMsg = htmlspecialchars($message);
    $emailHtml .= "<tr><td class=\"label\">Customer Note:</td><td class=\"value\">{$safeMsg}</td></tr>";
}

$emailHtml .= <<<HTML
        <tr><td class="label">Source Page:</td><td class="value">{$sourcePage}</td></tr>
        <tr><td class="label">Submission Time:</td><td class="value">{$istTimeFormatted} (IST)</td></tr>
      </table>
      <div class="cta-box">
        <p style="margin:0 0 12px 0; font-size:13px; color:#0369a1; font-weight:600;">Immediate technician dispatch recommended within 15 minutes.</p>
        <a href="tel:{$digitsOnly}" class="cta-btn">📞 Call {$digitsOnly}</a>
        <a href="https://wa.me/91{$digitsOnly}?text=Hello%20{$name}%2C%20this%20is%20FridgeFix%20Hyderabad%20regarding%20your%20service%20booking%20({$leadId})." class="wa-btn" target="_blank">💬 WhatsApp</a>
      </div>
    </div>
    <div class="footer">
      FridgeFix Hyderabad • Doorstep Refrigerator & Appliance Repair<br>
      Notification dispatched to: {LEAD_RECIPIENT_EMAIL}
    </div>
  </div>
</body>
</html>
HTML;

// Headers for PHP mail()
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=utf-8',
    'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM_EMAIL . '>',
    'Reply-To: ' . (!empty($email) ? $email : MAIL_FROM_EMAIL),
    'X-Mailer: PHP/' . phpversion()
];

try {
    $mailSent = @mail(
        LEAD_RECIPIENT_EMAIL,
        $emailSubject,
        $emailHtml,
        implode("\r\n", $headers)
    );
    if ($mailSent) {
        $emailSent = true;
    } else {
        $emailError = 'Native PHP mail() returned false. Check cPanel mail settings or configure SMTP.';
    }
} catch (Exception $ex) {
    $emailError = $ex->getMessage();
}

// -------------------------------------------------------------
// 7. Extract Privacy-Safe Public Lead for Real-Time Popup
// -------------------------------------------------------------
// Only First Name, Locality, Service, 0 mins
$nameParts = explode(' ', $name);
$firstName = !empty($nameParts[0]) ? $nameParts[0] : 'Customer';

$publicLead = [
    'id'      => $leadId,
    'name'    => $firstName,
    'service' => $service,
    'area'    => $location,
    'mins'    => 0,
    'isReal'  => true,
];

// -------------------------------------------------------------
// 8. Return JSON Response
// -------------------------------------------------------------
send_json_response([
    'success'    => true,
    'message'    => 'Your service request has been received! A verified technician will call you shortly.',
    'leadId'     => $leadId,
    'emailSent'  => $emailSent,
    'emailError' => $emailError,
    'publicLead' => $publicLead,
], 201);
