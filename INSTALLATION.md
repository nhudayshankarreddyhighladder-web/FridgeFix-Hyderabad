# FridgeFix Hyderabad - cPanel Deployment & Installation Guide

This guide explains step-by-step how to deploy **FridgeFix Hyderabad** onto any standard **cPanel shared hosting** account (such as Hostinger, GoDaddy, Bluehost, Namecheap, HostGator, InMotion, etc.).

---

## 📋 Architecture Overview

- **Frontend:** Responsive React Single Page Application (compiled into production static files `index.html` + `/assets/`).
- **Backend API:** Fast, secure PHP endpoints (`/api/submit-lead.php`, `/api/get-leads.php`).
- **Database:** MySQL / MariaDB via secure PDO prepared statements (`/database/database.sql`).
- **Admin Portal:** Session-protected PHP dashboard with real-time stats, lead status updater, and CSV export (`/admin/`).
- **Email Notifications:** Dispatched on every lead to `Coolcomfortsolutions13@gmail.com` via cPanel PHP `mail()` or SMTP.
- **Side Lead Notification:** Real-time polling with strict privacy masking (First Name & Locality only, never phone/email/address).
- **Web Server:** Apache with `.htaccess` (SPA routing, Gzip compression, browser caching, and security headers).

---

## 📂 Deployment Directory Structure on cPanel

Once deployed, your cPanel `public_html/` should look like this:

```text
public_html/
├── .htaccess                  <-- Apache rewrite rules for React SPA & API
├── index.html                 <-- Production React entry point
├── app-favicon.ico            <-- Favicon
├── assets/                    <-- Production JavaScript, CSS, and images
│   ├── index-*.js
│   └── index-*.css
├── api/                       <-- PHP API Endpoints
│   ├── config.php             <-- YOUR DATABASE & EMAIL CONFIGURATION
│   ├── db.php                 <-- PDO Connection Handler
│   ├── submit-lead.php        <-- POST endpoint for lead form submissions
│   ├── get-leads.php          <-- GET endpoint for side lead popup feed
│   ├── test-db.php            <-- Database diagnostic check
│   └── test-email.php         <-- Email delivery diagnostic check
├── admin/                     <-- Secure PHP Admin Panel
│   ├── index.php              <-- Lead management dashboard
│   ├── login.php              <-- Admin login page
│   ├── logout.php             <-- Session logout
│   ├── export-csv.php         <-- CSV exporter for Excel
│   └── style.css              <-- Admin dashboard stylesheet
└── database/
    └── database.sql           <-- MySQL Schema & initial sample data
```

---

## 🚀 Step-by-Step Installation Instructions

### Step 1: Create MySQL Database & User in cPanel

1. Log into your **cPanel** account.
2. Under the **Databases** section, click **MySQL® Database Wizard**.
3. **Step 1 - Create A Database:**
   - Enter a name (e.g. `fridgefix`).
   - Click **Next Step**. (Your full database name will be `youruser_fridgefix`).
4. **Step 2 - Create Database Users:**
   - Enter a username (e.g. `ffuser`).
   - Generate a strong password (save this password safely!).
   - Click **Create User**. (Your full username will be `youruser_ffuser`).
5. **Step 3 - Add User to Database:**
   - Check the box **ALL PRIVILEGES**.
   - Click **Make Changes**.

---

### Step 2: Import the Database Schema

1. Return to the cPanel Home and click **phpMyAdmin** (under Databases).
2. Select your newly created database from the left-hand sidebar (e.g. `youruser_fridgefix`).
3. Click the **Import** tab in the top navigation bar.
4. Click **Choose File** and select `database/database.sql` from this project.
5. Leave all settings at default (`utf8mb4` / `SQL`) and click **Import** (or **Go**).
6. You will see a success message: `Import has been successfully finished`. Two tables will be created:
   - `leads` (holds all service requests and bookings)
   - `admin_users` (holds admin credentials with bcrypt password hash)

---

### Step 3: Configure `api/config.php`

Open `api/config.php` in your code editor or cPanel File Manager and update lines 39–43:

```php
// Database Configuration
define('DB_HOST', 'localhost');          // Almost always 'localhost' on cPanel
define('DB_PORT', '3306');
define('DB_NAME', 'youruser_fridgefix'); // Full DB name from Step 1
define('DB_USER', 'youruser_ffuser');    // Full DB user from Step 1
define('DB_PASS', 'YourStrongPassword'); // DB Password from Step 1
```

#### Email Notification Target:
The default notification email is set to:
```php
define('LEAD_RECIPIENT_EMAIL', 'Coolcomfortsolutions13@gmail.com');
```
You can change this email or keep it as desired.

#### (Optional) SMTP Settings:
If you prefer SMTP over standard PHP `mail()`, change line 52 to `'smtp'` and fill in your SMTP credentials:
```php
define('MAIL_METHOD', 'smtp');
define('SMTP_HOST', 'mail.yourdomain.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'service@yourdomain.com');
define('SMTP_PASS', 'YourEmailPassword');
define('SMTP_SECURE', 'ssl');
```

---

### Step 4: Uploading Files to `public_html/`

#### Option A: Direct Upload via cPanel File Manager (Recommended)
1. In cPanel, click **File Manager** and open the `public_html/` directory.
2. Ensure you can view hidden files: Click **Settings** (top-right corner of File Manager) &rarr; check **Show Hidden Files (dotfiles)** &rarr; **Save**.
3. Create a `.zip` archive containing the production build files (`index.html`, `assets/`, `api/`, `admin/`, `database/`, `.htaccess`).
4. Click **Upload** in cPanel File Manager, drag and drop the `.zip` file.
5. Once uploaded, right-click the zip file in File Manager and select **Extract**.
6. Ensure that `index.html` and `.htaccess` sit directly inside `public_html/`.

#### Option B: Upload via FTP (FileZilla / WinSCP)
1. Connect to your host via FTP.
2. Navigate to `/public_html/`.
3. Upload all files and folders directly.

---

### Step 5: Test and Verify the Installation

1. **Verify Database Connection:**
   Visit `https://yourdomain.com/api/test-db.php` in your browser.
   - It will verify the database connection and confirm that the `leads` and `admin_users` tables are detected.
   - If connected, it will display a green success banner!

2. **Verify Email Delivery:**
   Visit `https://yourdomain.com/api/test-email.php` in your browser.
   - Click **Send Test Email Now**.
   - Check your inbox at `Coolcomfortsolutions13@gmail.com` to confirm email receipt.

---

### Step 6: Test Customer Booking & Side Lead Popup

1. Open your live website: `https://yourdomain.com/`
2. Scroll to any booking form or click **Book Service**.
3. Fill in a test booking (e.g. Name: *Suresh Reddy*, Phone: *9848011223*, Locality: *Madhapur*, Service: *Double Door Refrigerator Repair*).
4. Click **Book Verified Technician**.
5. You will receive an instant on-screen booking confirmation with a unique Lead ID (e.g., `FF-XXXXX`).
6. **Side Lead Popup:** The floating notification at the bottom corner will immediately show:
   *"Suresh from Madhapur requested Double Door Refrigerator Repair (Just now)"*.
   *(Notice: Strict privacy is enforced. Phone number, email, and private message are NEVER exposed).*
7. Check `Coolcomfortsolutions13@gmail.com` for the full email notification containing the customer's phone number and direct Click-to-Call / WhatsApp buttons.

---

### Step 7: Access the Admin Dashboard

1. Navigate to: `https://yourdomain.com/admin/`
2. Log in using the initial default credentials:
   - **Username:** `admin`
   - **Password:** `admin@FridgeFix2025`
3. In the Admin Dashboard, you can:
   - View real-time metrics: Total Leads, New, Contacted, In Progress, Completed, Cancelled.
   - Filter leads by status and search by customer name, locality, or phone number.
   - Click 📞 **Call Customer** or 💬 **WhatsApp** for 1-click customer response.
   - Update lead statuses as technicians are dispatched.
   - Click **Export CSV** to download all leads into Microsoft Excel / Google Sheets.

---

## 🔒 Security Best Practices

1. **Change Default Admin Password:**
   Generate a new bcrypt hash for your chosen password (e.g. via PHP `password_hash('MyNewPassword', PASSWORD_BCRYPT)`) and update `admin_users` table in phpMyAdmin.
2. **File Permissions:**
   - Directories: `755`
   - PHP and HTML files: `644`
3. **Protect Sensitive Files:**
   The included `.htaccess` file blocks direct browser access to `.env`, `database.sql`, `leads.json`, etc.
4. **Enable Free SSL / HTTPS:**
   In cPanel, click **SSL/TLS Status** &rarr; select your domain &rarr; click **Run AutoSSL** to enable free Let's Encrypt HTTPS.

---

## 🛠️ Troubleshooting & FAQ

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **Subpages show 404 (e.g. `/refrigerator-repair`)** | `.htaccess` is missing or `mod_rewrite` is disabled. | Ensure `.htaccess` is uploaded to `public_html/` and hidden files are visible in cPanel File Manager. |
| **Database Connection Error** | Incorrect credentials in `api/config.php`. | Open `api/config.php` and verify `DB_NAME`, `DB_USER`, and `DB_PASS`. In cPanel, DB names are prefixed with your username (e.g., `cpaneluser_dbname`). Test via `/api/test-db.php`. |
| **Email Not Received** | cPanel server Exim mail restrictions or going to spam. | 1. Check your Gmail **Spam folder**.<br>2. In cPanel, visit **Email Deliverability** and enable SPF & DKIM records.<br>3. Alternatively, switch `MAIL_METHOD` to `'smtp'` in `api/config.php`. |
| **Admin login says "Invalid username or password"** | `admin_users` table was not imported. | Re-import `database/database.sql` into your database using phpMyAdmin. |
| **PHP Version Compatibility** | Ancient PHP version. | In cPanel &rarr; **Select PHP Version** (or **MultiPHP Manager**), set PHP to **8.0, 8.1, 8.2, or 8.3**. |
