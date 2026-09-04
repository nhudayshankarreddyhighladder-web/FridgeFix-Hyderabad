<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Lightweight Native PHP SMTP Client
 * ====================================================================
 * Standalone SMTP socket client compatible with cPanel Exim, Gmail,
 * Zoho, SendGrid, and standard hosting servers.
 * Does not require composer or external dependencies.
 * Uses secure TLS/SSL verification by default.
 */

class SimpleSMTP {
    private $host;
    private $port;
    private $username;
    private $password;
    private $encryption;
    private $timeout = 25;
    private $socket = null;
    private $lastError = '';

    public function __construct($host, $port, $username, $password, $encryption = 'ssl') {
        $this->host = trim($host);
        $this->port = (int)$port;
        $this->username = trim($username);
        $this->password = $password;
        $this->encryption = strtolower(trim($encryption));
    }

    public function getLastError() {
        return $this->lastError;
    }

    private function readResponse() {
        $response = '';
        while ($str = fgets($this->socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) === ' ') {
                break;
            }
        }
        return $response;
    }

    private function sendCommand($cmd) {
        fwrite($this->socket, $cmd . "\r\n");
        return $this->readResponse();
    }

    public function send($fromEmail, $fromName, $toEmail, $subject, $bodyText, $bodyHtml = '') {
        $errno = 0;
        $errstr = '';

        $protocol = '';
        if ($this->encryption === 'ssl') {
            $protocol = 'ssl://';
        }

        $remoteAddress = $protocol . $this->host . ':' . $this->port;
        
        // Secure SSL/TLS certificate verification (enabled by default)
        $verifyPeer = defined('SMTP_VERIFY_PEER') ? (bool)SMTP_VERIFY_PEER : true;

        $contextOptions = [
            'ssl' => [
                'verify_peer'       => $verifyPeer,
                'verify_peer_name'  => $verifyPeer,
                'allow_self_signed' => !$verifyPeer
            ]
        ];

        $context = stream_context_create($contextOptions);

        $this->socket = @stream_socket_client(
            $remoteAddress,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$this->socket) {
            $this->lastError = "Could not connect to SMTP host {$this->host}:{$this->port} ($errstr)";
            return false;
        }

        // Set socket timeout for subsequent reads
        stream_set_timeout($this->socket, $this->timeout);

        $res = $this->readResponse();
        if (substr($res, 0, 3) !== '220') {
            $this->lastError = "Server rejected connection: $res";
            fclose($this->socket);
            return false;
        }

        // Send EHLO
        $clientHost = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
        $res = $this->sendCommand("EHLO $clientHost");

        // STARTTLS if requested on port 587 or encryption = tls
        if ($this->encryption === 'tls' || $this->port === 587) {
            $res = $this->sendCommand("STARTTLS");
            if (substr($res, 0, 3) === '220') {
                $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
                if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                    $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
                }
                if (!stream_socket_enable_crypto($this->socket, true, $cryptoMethod)) {
                    $this->lastError = "Failed to establish TLS encryption with SMTP host";
                    fclose($this->socket);
                    return false;
                }
                $res = $this->sendCommand("EHLO $clientHost");
            }
        }

        // Authenticate if credentials provided
        if (!empty($this->username) && !empty($this->password)) {
            $res = $this->sendCommand("AUTH LOGIN");
            if (substr($res, 0, 3) !== '334') {
                $this->lastError = "AUTH LOGIN not accepted: $res";
                fclose($this->socket);
                return false;
            }

            $res = $this->sendCommand(base64_encode($this->username));
            if (substr($res, 0, 3) !== '334') {
                $this->lastError = "Username rejected: $res";
                fclose($this->socket);
                return false;
            }

            $res = $this->sendCommand(base64_encode($this->password));
            if (substr($res, 0, 3) !== '235') {
                $this->lastError = "Authentication failed (invalid credentials): $res";
                fclose($this->socket);
                return false;
            }
        }

        // MAIL FROM
        $res = $this->sendCommand("MAIL FROM: <$fromEmail>");
        if (substr($res, 0, 3) !== '250') {
            $this->lastError = "MAIL FROM rejected: $res";
            fclose($this->socket);
            return false;
        }

        // RCPT TO
        $res = $this->sendCommand("RCPT TO: <$toEmail>");
        if (substr($res, 0, 3) !== '250') {
            $this->lastError = "RCPT TO rejected: $res";
            fclose($this->socket);
            return false;
        }

        // DATA
        $res = $this->sendCommand("DATA");
        if (substr($res, 0, 3) !== '354') {
            $this->lastError = "DATA command rejected: $res";
            fclose($this->socket);
            return false;
        }

        // Build Email MIME Content
        $boundary = "==Multipart_Boundary_x" . md5(time() . mt_rand()) . "x";
        $headers  = "From: $fromName <$fromEmail>\r\n";
        $headers .= "Reply-To: $fromEmail\r\n";
        $headers .= "To: <$toEmail>\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "Message-ID: <" . time() . "." . md5($subject) . "@" . (!empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'fridgefixhyderabad.com') . ">\r\n";
        $headers .= "X-Mailer: FridgeFix Native SMTP\r\n";
        $headers .= "MIME-Version: 1.0\r\n";

        if (!empty($bodyHtml)) {
            $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n\r\n";
            $message  = "--$boundary\r\n";
            $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $message .= $bodyText . "\r\n\r\n";
            $message .= "--$boundary\r\n";
            $message .= "Content-Type: text/html; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $message .= $bodyHtml . "\r\n\r\n";
            $message .= "--$boundary--\r\n";
        } else {
            $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $headers .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $message = $bodyText . "\r\n";
        }

        fwrite($this->socket, $headers . $message . "\r\n.\r\n");
        $res = $this->readResponse();

        if (substr($res, 0, 3) !== '250') {
            $this->lastError = "Message content rejected: $res";
            fclose($this->socket);
            return false;
        }

        $this->sendCommand("QUIT");
        fclose($this->socket);
        return true;
    }
}
