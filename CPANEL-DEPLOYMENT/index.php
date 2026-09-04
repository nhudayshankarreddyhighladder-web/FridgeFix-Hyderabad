<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Front Controller & Fallback Loader
 * ====================================================================
 * On cPanel hosting setups where DirectoryIndex evaluates index.php 
 * before index.html, this script ensures the production SPA is served.
 */

$htmlFile = __DIR__ . '/index.html';

if (file_exists($htmlFile)) {
    // Send standard HTTP headers
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    readfile($htmlFile);
    exit;
} else {
    http_response_code(500);
    echo '<!DOCTYPE html><html><head><title>FridgeFix Hyderabad</title></head><body>';
    echo '<h2>Deployment in progress</h2>';
    echo '<p>index.html is missing. Please ensure all build files are uploaded.</p>';
    echo '</body></html>';
    exit;
}
