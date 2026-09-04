<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Email Delivery Diagnostic Tool
 * ====================================================================
 * Route: GET /api/test-email.php
 * 
 * SECURITY NOTICE:
 * This tool is intended for setup verification only.
 * Delete or rename this file after confirming production deployment.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/smtp.php';

$sent = null;
$error = null;
$methodUsed = '';

if (isset($_POST['send_test'])) {
    $testSubject = "Test Email Verification - FridgeFix Hyderabad";
    $testTime = date('d M Y, h:i A') . ' IST';

    $testBodyText = <<<TEXT
FRIDGEFIX HYDERABAD - EMAIL DELIVERY TEST

This is a diagnostic test email verifying that email notifications from your cPanel hosting are operating properly.

Recipient: Coolcomfortsolutions13@gmail.com
Timestamp: {$testTime}
Method: {$methodUsed}

If you received this message, lead dispatch notifications will be successfully delivered!
TEXT;

    $testBodyHtml = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif; background:#f8fafc; padding:20px;">
  <div style="max-width:500px; margin:0 auto; background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0;">
    <h2 style="color:#0788C9; margin-top:0;">FridgeFix Hyderabad</h2>
    <p><strong>✅ Email Delivery Diagnostic Test Successful!</strong></p>
    <p>This verifies that notifications from your cPanel server can reach <strong>Coolcomfortsolutions13@gmail.com</strong>.</p>
    <p style="font-size:12px; color:#64748b;">Timestamp: {$testTime}</p>
  </div>
</body>
</html>
HTML;

    if (MAIL_METHOD === 'smtp' && !empty(SMTP_HOST) && SMTP_HOST !== 'mail.yourdomain.com') {
        $methodUsed = 'Authenticated SMTP (' . SMTP_HOST . ':' . SMTP_PORT . ')';
        try {
            $smtp = new SimpleSMTP(
                SMTP_HOST,
                SMTP_PORT,
                SMTP_USERNAME,
                SMTP_PASSWORD,
                SMTP_ENCRYPTION
            );
            $sent = $smtp->send(
                SMTP_FROM_EMAIL,
                SMTP_FROM_NAME,
                LEAD_RECIPIENT_EMAIL,
                $testSubject,
                $testBodyText,
                $testBodyHtml
            );
            if (!$sent) {
                $error = $smtp->getLastError();
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
    } else {
        $methodUsed = 'Native PHP mail() / cPanel Sendmail';
        $boundary = "==Multipart_Boundary_x" . md5(time()) . "x";
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
            'From: ' . SMTP_FROM_NAME . ' <' . SMTP_FROM_EMAIL . '>',
            'Reply-To: ' . SMTP_FROM_EMAIL,
            'X-Mailer: PHP/' . phpversion()
        ];

        $body  = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
        $body .= $testBodyText . "\r\n\r\n";
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
        $body .= $testBodyHtml . "\r\n\r\n";
        $body .= "--$boundary--\r\n";

        $sent = @mail(
            LEAD_RECIPIENT_EMAIL,
            $testSubject,
            $body,
            implode("\r\n", $headers)
        );

        if (!$sent) {
            $error = 'PHP mail() function returned false. Check cPanel Exim Mail service or configure authenticated SMTP in api/config.php.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FridgeFix Email Delivery Diagnostic</title>
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
        .btn-send { background: #0788C9; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; font-size: 14px; cursor: pointer; }
        .btn-send:hover { background: #066fa5; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>FridgeFix Hyderabad</h1>
            <p>Email Notification Delivery Diagnostic</p>
        </div>
        <div class="content">
            <!-- Security Warning -->
            <div class="banner banner-warning">
                ⚠️ <strong>Security Notice:</strong> This diagnostic tool is intended for initial setup verification only. Please delete or rename this file (<code>api/test-email.php</code>) after confirming email delivery.
            </div>

            <?php if ($sent === true): ?>
                <div class="banner banner-success">
                    ✅ <strong>Test Email Dispatched Successfully!</strong><br>
                    Dispatched to <strong><?= htmlspecialchars(LEAD_RECIPIENT_EMAIL) ?></strong> via <?= htmlspecialchars($methodUsed) ?>.<br>
                    Please check your Gmail inbox and Spam/Promotions folder.
                </div>
            <?php elseif ($sent === false): ?>
                <div class="banner banner-error">
                    ❌ <strong>Email Dispatch Failed!</strong><br>
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <h3>Current Email Configuration (from api/config.php)</h3>
            <table>
                <tr>
                    <td class="label">Delivery Method:</td>
                    <td class="value"><strong><?= htmlspecialchars(strtoupper(MAIL_METHOD)) ?></strong></td>
                </tr>
                <tr>
                    <td class="label">Target Recipient:</td>
                    <td class="value"><strong><?= htmlspecialchars(LEAD_RECIPIENT_EMAIL) ?></strong></td>
                </tr>
                <tr>
                    <td class="label">From Name &amp; Email:</td>
                    <td class="value"><?= htmlspecialchars(SMTP_FROM_NAME) ?> &lt;<?= htmlspecialchars(SMTP_FROM_EMAIL) ?>&gt;</td>
                </tr>
                <?php if (MAIL_METHOD === 'smtp'): ?>
                <tr>
                    <td class="label">SMTP Server:</td>
                    <td class="value"><?= htmlspecialchars(SMTP_HOST) ?>:<?= htmlspecialchars(SMTP_PORT) ?> (<?= htmlspecialchars(strtoupper(SMTP_ENCRYPTION)) ?>)</td>
                </tr>
                <tr>
                    <td class="label">SMTP Username:</td>
                    <td class="value"><?= htmlspecialchars(SMTP_USERNAME) ?></td>
                </tr>
                <tr>
                    <td class="label">SMTP Password:</td>
                    <td class="value"><?= !empty(SMTP_PASSWORD) ? '[Configured - Hidden]' : '[Not Set]' ?></td>
                </tr>
                <tr>
                    <td class="label">SSL Verification:</td>
                    <td class="value"><?= SMTP_VERIFY_PEER ? 'Enabled (Strict)' : 'Disabled' ?></td>
                </tr>
                <?php endif; ?>
            </table>

            <form method="POST" style="margin-top: 24px;">
                <input type="hidden" name="send_test" value="1">
                <button type="submit" class="btn-send">
                    📧 Send Test Email to <?= htmlspecialchars(LEAD_RECIPIENT_EMAIL) ?>
                </button>
            </form>
        </div>
    </div>
</body>
</html>
