<?php
/**
 * ====================================================================
 * FridgeFix Hyderabad - Lightweight Native PHP SMTP Client
 * ====================================================================
 * Standalone SMTP socket client compatible with cPanel Exim, Gmail,
 * Zoho, SendGrid, and standard hosting servers.
 * Does not require composer or external dependencies.
 */

class SimpleSMTP {
    private $host;
    private $port;
    private $username;
    private $password;
    private $encryption;
    private $timeout = 20;
    private $socket = null;
    private $lastError = '';

    public function __construct($host, $port, $username, $password, $encryption = 'ssl') {
        $this->host = $host;
        $this->port = (int)$port;
        $this->username = $username;
        $this->password = $password;
        $this->encryption = strtolower($encryption);
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
        
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

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

        $res = $this->readResponse();
        if (substr($res, 0, 3) !== '220') {
            $this->lastError = "Server rejected connection: $res";
            fclose($this->socket);
            return false;
        }

        // Send EHLO
        $clientHost = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
        $res = $this->sendCommand("EHLO $clientHost");

        // STARTTLS if requested on port 587
        if ($this->encryption === 'tls') {
            $res = $this->sendCommand("STARTTLS");
            if (substr($res, 0, 3) === '220') {
                if (!stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT)) {
                    $this->lastError = "Failed to establish TLS encryption";
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
                $this->lastError = "Authentication failed (bad credentials): $res";
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
            $this->lastError = "DATA rejected: $res";
            fclose($this->socket);
            return false;
        }

        // Build Email MIME Content
        $boundary = "==Multipart_Boundary_x" . md5(time()) . "x";
        $headers  = "From: $fromName <$fromEmail>\r\n";
        $headers .= "Reply-To: $fromEmail\r\n";
        $headers .= "To: <$toEmail>\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "MIME-Version: 1.0\r\n";

        if (!empty($bodyHtml)) {
            $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n\r\n";
            $message  = "--$boundary\r\n";
            $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $message .= $bodyText . "\r\n\r\n";
            $message .= "--$boundary\r\n";
            $message .= "Content-Type: text/html; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $message .= $bodyHtml . "\r\n\r\n";
            $message .= "--$boundary--\r\n";
        } else {
            $headers .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
            $message = $bodyText . "\r\n";
        }

        fwrite($this->socket, $headers . $message . "\r\n.\r\n");
        $res = $this->readResponse();

        if (substr($res, 0, 3) !== '250') {
            $this->lastError = "Message data rejected: $res";
            fclose($this->socket);
            return false;
        }

        $this->sendCommand("QUIT");
        fclose($this->socket);
        return true;
    }
}
