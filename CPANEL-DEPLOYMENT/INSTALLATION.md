# FridgeFix Hyderabad — cPanel Production Installation Guide

This guide provides the exact 15-step procedure to deploy the **FridgeFix Hyderabad** website onto any standard **cPanel shared hosting** account (Apache, PHP 7.4/8.0/8.1/8.2/8.3, and MySQL/MariaDB).

---

## 📋 Architecture Overview

- **Frontend:** React Single Page Application compiled to static assets (`index.html` + `/assets/`).
- **Backend API:** Native PHP endpoints (`/api/submit-lead.php`, `/api/get-leads.php`).
- **Database:** MySQL / MariaDB via secure PDO prepared statements (`/database/database.sql`).
- **Admin Portal:** Session-protected PHP dashboard with real-time stats and CSV export (`/admin/`).
- **Email Notifications:** Dispatched via Authenticated SMTP or standard cPanel Exim `mail()` to `Coolcomfortsolutions13@gmail.com`.
- **Side Lead Notification:** Real-time privacy-masked social proof feed (First Name and Locality only).
- **Web Server:** Apache with `.htaccess` handling SPA routing, asset caching, Gzip compression, and security headers.
- **Runtime Dependency:** Zero Node.js, zero npm, zero build tools needed on the hosting server.

---

## 📂 Deployment Folder Layout

When uploaded, your cPanel `public_html/` will contain:

```text
public_html/
├── .htaccess                  <-- Apache rewrite rules for React SPA, API & security
├── index.html                 <-- Production React entry point
├── robots.txt                 <-- Search engine crawling directives
├── sitemap.xml                <-- XML sitemap for Google Search Console
├── assets/                    <-- Production JavaScript, CSS, and images
│   ├── index-*.js
│   └── index-*.css
├── api/                       <-- Production PHP Backend
│   ├── config.php             <-- DATABASE & SMTP SETTINGS
│   ├── db.php                 <-- PDO Connection Handler
│   ├── smtp.php               <-- Standalone Authenticated SMTP Client
│   ├── submit-lead.php        <-- POST endpoint for lead form submissions
│   ├── get-leads.php          <-- GET endpoint for public side popup feed
│   ├── test-db.php            <-- Diagnostic tool for MySQL connectivity
│   └── test-email.php         <-- Diagnostic tool for email delivery
├── admin/                     <-- Secure PHP Admin Panel
│   ├── index.php              <-- Lead management dashboard with CSRF protection
│   ├── login.php              <-- Admin login page (password_verify)
│   ├── logout.php             <-- Session termination
│   ├── export-csv.php         <-- One-click Excel CSV export
│   └── style.css              <-- Admin interface styling
└── database/
    ├── .htaccess              <-- Blocks direct browser access to SQL files
    └── database.sql           <-- MySQL Schema & initial sample data
```

---

## 🚀 15-Step Production Installation Procedure

Follow these steps in numerical order:

### Step 1: Uploading CPANEL-DEPLOYMENT to `public_html`
1. Log into your hosting account and open **cPanel**.
2. Under **Files**, click **File Manager** and open the `public_html` directory.
3. In File Manager settings (gear icon top right), ensure **Show Hidden Files (dotfiles)** is checked so `.htaccess` is visible.
4. Compress the contents of the `CPANEL-DEPLOYMENT/` folder into a `.zip` archive on your local computer.
5. In cPanel File Manager, click **Upload** and select your `.zip` archive.
6. Once uploaded, right-click the `.zip` file and click **Extract**.
7. Confirm that `index.html`, `.htaccess`, `api/`, and `admin/` are located directly inside `public_html/`.

---

### Step 2: Creating MySQL Database
1. In cPanel Home under **Databases**, open **MySQL® Database Wizard** (or **MySQL® Databases**).
2. Enter a new database name (for example: `fridgefix`).
3. Click **Next Step**.
4. Note down your full database name (e.g. `cpaneluser_fridgefix`).

---

### Step 3: Creating Database User
1. In the same wizard, enter a database username (for example: `ffuser`).
2. Generate or enter a strong password.
3. Save this password safely in your notes.
4. Click **Create User**.
5. Note down your full username (e.g. `cpaneluser_ffuser`).

---

### Step 4: Assigning Privileges
1. On the **Add User to Database** screen, check the box for **ALL PRIVILEGES**.
2. Click **Make Changes** or **Next Step**.

---

### Step 5: Importing `database.sql`
1. Return to cPanel Home and click **phpMyAdmin** under the Databases section.
2. Select your newly created database from the left-hand navigation tree (`cpaneluser_fridgefix`).
3. Click the **Import** tab in the top navigation bar.
4. Click **Choose File** and select `database/database.sql` from your computer or server.
5. Click **Import** (or **Go**).
6. Verify that two tables are created: `leads` and `admin_users`.

---

### Step 6: Editing `api/config.php`
1. In cPanel File Manager, navigate to `public_html/api/` and edit `config.php`.
2. Update the database configuration block with your credentials from Steps 2, 3, and 4:
```php
define('DB_HOST', 'localhost'); // Almost always 'localhost' on cPanel
define('DB_PORT', '3306');
define('DB_NAME', 'cpaneluser_fridgefix');
define('DB_USER', 'cpaneluser_ffuser');
define('DB_PASSWORD', 'YourStrongPasswordHere');
```
3. Save the file.

---

### Step 7: Configuring SMTP
1. In the same `api/config.php` file, locate the **SMTP & EMAIL CONFIGURATION** section.
2. Set your SMTP credentials (you can use your domain's cPanel webmail account, or external SMTP like Gmail / Zoho / SendGrid):
```php
define('MAIL_METHOD', 'smtp'); // 'smtp' for authenticated SMTP, or 'mail' for PHP mail()
define('SMTP_HOST', 'mail.yourdomain.com');
define('SMTP_PORT', 465); // 465 for SSL, 587 for TLS
define('SMTP_USERNAME', 'notifications@yourdomain.com');
define('SMTP_PASSWORD', 'YourEmailAccountPassword');
define('SMTP_ENCRYPTION', 'ssl'); // 'ssl' or 'tls'
define('SMTP_VERIFY_PEER', true); // Strict TLS certificate verification
define('SMTP_FROM_EMAIL', 'no-reply@yourdomain.com');
define('SMTP_FROM_NAME', 'FridgeFix Hyderabad');
```
3. Save the file.

---

### Step 8: Setting Recipient Email
1. Confirm that `LEAD_RECIPIENT_EMAIL` in `api/config.php` is set to:
```php
define('LEAD_RECIPIENT_EMAIL', 'Coolcomfortsolutions13@gmail.com');
define('LEAD_RECIPIENT_NAME', 'FridgeFix Hyderabad Dispatch');
```
2. Every customer booking enquiry will be delivered directly to this address.

---

### Step 9: Testing Database Connection
1. In your web browser, navigate to:
   `https://yourdomain.com/api/test-db.php`
2. You will see a green success message: **Database Connected Successfully!**
3. The page will verify that both `leads` and `admin_users` tables are detected and report the row count.

---

### Step 10: Testing Email Delivery
1. In your web browser, navigate to:
   `https://yourdomain.com/api/test-email.php`
2. Click **Send Test Email to Coolcomfortsolutions13@gmail.com**.
3. Verify that a green confirmation message appears.
4. Check the inbox (and Spam/Promotions folder) at `Coolcomfortsolutions13@gmail.com` to confirm email receipt.

---

### Step 11: Testing Customer Lead Form
1. Open your live homepage: `https://yourdomain.com/`.
2. Scroll to any booking form or click **Book Service**.
3. Submit a test enquiry:
   - **Name:** Suresh Reddy
   - **Phone:** 9848011223
   - **Locality:** Madhapur
   - **Service:** Double Door Refrigerator Repair
4. Click **Book Verified Technician**.
5. Verify that an instant on-screen booking confirmation appears with a unique Lead ID (e.g. `FF-XXXXX`).
6. Confirm that an email notification is delivered to `Coolcomfortsolutions13@gmail.com` with the subject:
   `New Service Lead - FridgeFix Hyderabad`

---

### Step 12: Testing Side Lead Popup
1. Keep the homepage open after submitting the test booking.
2. The side notification popup at the bottom corner will immediately show your new booking:
   *"Suresh from Madhapur requested Double Door Refrigerator Repair (Just now)"*.
3. Verify that only the first name, locality, and service are displayed — phone number, email, and private messages are strictly hidden.
4. Notice how subsequent dummy leads rotate smoothly when no new submissions occur.

---

### Step 13: Logging into Admin Dashboard
1. In your browser, open:
   `https://yourdomain.com/admin/`
2. Enter the default credentials:
   - **Username:** `admin`
   - **Password:** `admin@FridgeFix2025`
3. Click **Sign In to Dashboard**.
4. Test the dashboard features:
   - Verify your test lead appears at the top of the table.
   - Change the lead status from `New` to `Contacted`.
   - Test the 📞 **Call** and 💬 **WhatsApp** one-click customer action buttons.
   - Click **Export CSV** to download all leads into a Microsoft Excel-compatible spreadsheet.

---

### Step 14: Enabling Free SSL / HTTPS
1. In cPanel Home, scroll to **Security** and click **SSL/TLS Status**.
2. Select your domain name.
3. Click **Run AutoSSL**.
4. Within 2–5 minutes, cPanel will install a free Let's Encrypt / Sectigo SSL certificate.
5. In cPanel **Domains**, toggle **Force HTTPS Redirect** to ON.

---

### Step 15: Removing / Disabling Diagnostic Endpoints After Testing
1. For security best practices once deployment and email delivery are confirmed:
   - In cPanel File Manager, go to `public_html/api/`.
   - Delete or rename the two diagnostic files:
     - `api/test-db.php`
     - `api/test-email.php`
2. Your production setup is now fully secure and hardened against unauthorized inspection!

---

## 🔒 Security Best Practices Checklist

- [x] Passwords stored in MySQL use industry-standard bcrypt hashes (`password_verify`).
- [x] All database operations use PDO prepared statements with parameter binding.
- [x] Admin dashboard actions are protected by anti-CSRF session tokens.
- [x] Direct browser access to `.htaccess`, `.env`, `database/`, `config.php`, and `leads.json` is blocked with HTTP 403 Forbidden.
- [x] Anti-spam honeypot filter and 30-second submission rate limiting prevent bot abuse.
- [x] Customer telephone numbers and private notes are never broadcast through the public lead popup API.
