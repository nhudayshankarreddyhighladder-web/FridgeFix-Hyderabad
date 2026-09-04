<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Email Diagnostic & Test Dispatcher
 * ====================================================================
 * Route: /api/test-email.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

$message = null;
$error = null;

if (isset($_POST['send_test'])) {
    $to = LEAD_RECIPIENT_EMAIL;
    $subject = "FridgeFix Email Test Notification [" . date('d M Y H:i:s') . "]";
    
    $htmlContent = "
    <div style='font-family: Arial, sans-serif; padding: 20px; background: #f8fafc;'>
        <div style='max-width: 500px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;'>
            <h2 style='color: #0788C9; margin-top: 0;'>FridgeFix Hyderabad Email Test</h2>
            <p>This is a verification email from your cPanel server to confirm that leads will be properly delivered to your inbox.</p>
            <p><strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . " (IST)</p>
            <p><strong>Server Host:</strong> " . htmlspecialchars($_SERVER['HTTP_HOST'] ?? 'cPanel') . "</p>
            <p><strong>Configured Recipient:</strong> " . htmlspecialchars(LEAD_RECIPIENT_EMAIL) . "</p>
            <div style='margin-top: 20px; padding: 12px; background: #ecfdf5; border-radius: 6px; color: #065f46; font-weight: bold;'>
                ✅ Email routing is working properly!
            </div>
        </div>
    </div>
    ";

    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM_EMAIL . '>',
        'Reply-To: ' . MAIL_FROM_EMAIL,
        'X-Mailer: PHP/' . phpversion()
    ];

    try {
        $sent = @mail($to, $subject, $htmlContent, implode("\r\n", $headers));
        if ($sent) {
            $message = "Test email dispatched successfully to <strong>" . htmlspecialchars($to) . "</strong>! Please check your inbox (and Spam folder).";
        } else {
            $error = "PHP mail() function returned false. Check your cPanel server's Exim / Sendmail status or switch to SMTP in api/config.php.";
        }
    } catch (Exception $e) {
        $error = "Exception while sending mail: " . htmlspecialchars($e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>FridgeFix - Email Diagnostic Test</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 40px 20px; color: #1e293b; }
        .box { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        h1 { color: #0788C9; margin-top: 0; font-size: 22px; }
        .alert { padding: 12px 16px; border-radius: 8px; font-size: 14px; margin: 15px 0; }
        .alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .btn { display: inline-block; background: #0788C9; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; }
        .btn:hover { background: #026ca2; }
    </style>
</head>
<body>
    <div class="box">
        <h1>FridgeFix Email Delivery Test</h1>
        <p>This utility sends a test email to your configured recipient address:</p>
        <p><strong>Configured Target:</strong> <code><?= htmlspecialchars(LEAD_RECIPIENT_EMAIL) ?></code></p>
        <p><strong>Configured Sender:</strong> <code><?= htmlspecialchars(MAIL_FROM_NAME) ?> &lt;<?= htmlspecialchars(MAIL_FROM_EMAIL) ?>&gt;</code></p>

        <?php if ($message): ?>
            <div class="alert alert-success"><?= $message ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-error"><?= $error ?></div>
        <?php endif; ?>

        <form method="POST" style="margin-top: 25px;">
            <button type="submit" name="send_test" value="1" class="btn">🚀 Send Test Email Now</button>
        </form>

        <p style="margin-top: 25px; font-size: 12px; color: #64748b;">
            Tip: In cPanel, make sure your domain has SPF and DKIM configured under "Email Deliverability" so that emails reach Gmail without going to spam.
        </p>
    </div>
</body>
</html>
