import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const LEADS_FILE = path.join(process.cwd(), 'leads.json');

// Interface
interface StoredLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  appliance?: string;
  brand?: string;
  problem?: string;
  location: string;
  preferredDate?: string;
  message?: string;
  sourcePage: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

// Load leads from file
function loadLeads(): StoredLead[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads file:', err);
  }
  return [];
}

// Save leads to file
function saveLeads(leads: StoredLead[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing leads file:', err);
  }
}

// Recent real leads in memory for immediate feed broadcast
let recentRealLeads: Array<{
  id: string;
  name: string;
  service: string;
  area: string;
  mins: number;
  isReal: boolean;
}> = [];

// Initialize recent real leads from stored leads
const storedInitial = loadLeads();
recentRealLeads = storedInitial.slice(0, 10).map((l) => ({
  id: l.id,
  name: (l.name || 'Customer').trim().split(' ')[0],
  service: l.service || 'Refrigerator Repair',
  area: l.location || 'Hyderabad',
  mins: Math.max(0, Math.round((Date.now() - new Date(l.createdAt).getTime()) / 60000)),
  isReal: true,
}));

// Rate limiting map (phone + service -> timestamp)
const recentSubmissions = new Map<string, number>();

// --- API ROUTES ---

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FridgeFix Hyderabad Lead System',
    timestamp: new Date().toISOString(),
    recipientEmail: process.env.LEAD_RECIPIENT_EMAIL || 'Coolcomfortsolutions13@gmail.com',
    hasEmailKey: Boolean(process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY),
  });
});

// GET recent public leads (sanitized for privacy - first name, area, service only)
const handleGetLeads = (_req: Request, res: Response) => {
  // Recalculate mins
  const updated = recentRealLeads.map((l) => ({
    ...l,
    mins: Math.max(0, Math.round((Date.now() - (l as any)._timestamp || Date.now()) / 60000)),
  }));
  res.json({ success: true, count: updated.length, leads: updated });
};

app.get('/api/leads/recent', handleGetLeads);
app.get('/api/get-leads.php', handleGetLeads);
app.get('/api/get-leads', handleGetLeads);

// Lead submission handler function
const handleLeadSubmission = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      phone,
      email,
      service,
      appliance,
      brand,
      problem,
      location,
      preferredDate,
      message,
      sourcePage,
      botField, // Honeypot field
    } = req.body;

    // Honeypot anti-spam check
    if (botField) {
      console.warn('[Anti-Spam] Bot submission blocked via honeypot');
      return res.status(200).json({ success: true, message: 'Enquiry received.' });
    }

    // Validation
    const cleanName = (name || '').toString().trim();
    const rawPhone = (phone || '').toString().replace(/[^0-9+]/g, '').trim();
    const cleanService = (service || '').toString().trim();
    const cleanLocation = (location || '').toString().trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (minimum 2 characters).' });
    }

    // Validate phone number: minimum 10 digits
    const digitsOnly = rawPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!cleanService) {
      return res.status(400).json({ success: false, error: 'Please select an appliance or repair service.' });
    }

    if (!cleanLocation) {
      return res.status(400).json({ success: false, error: 'Please select or enter your area / locality in Hyderabad.' });
    }

    // Prevent rapid duplicate submissions (within 20 seconds)
    const rateKey = `${digitsOnly}-${cleanService}`;
    const now = Date.now();
    const lastSub = recentSubmissions.get(rateKey);
    if (lastSub && now - lastSub < 20000) {
      return res.status(429).json({
        success: false,
        error: 'You have recently submitted an enquiry. Our technician team is already reviewing it!',
      });
    }
    recentSubmissions.set(rateKey, now);

    // Create lead object
    const leadId = `FF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newLead: StoredLead = {
      id: leadId,
      name: cleanName,
      phone: rawPhone,
      email: (email || '').toString().trim(),
      service: cleanService,
      appliance: (appliance || 'Refrigerator').toString().trim(),
      brand: (brand || '').toString().trim(),
      problem: (problem || '').toString().trim(),
      location: cleanLocation,
      preferredDate: (preferredDate || '').toString().trim(),
      message: (message || '').toString().trim(),
      sourcePage: (sourcePage || '/').toString().trim(),
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    // Save lead to persistent storage
    const allLeads = loadLeads();
    allLeads.unshift(newLead);
    saveLeads(allLeads);

    // Add to public popup feed (privacy protected: first name, locality, service only!)
    const firstName = cleanName.split(' ')[0] || 'Customer';
    const publicLead = {
      id: newLead.id,
      name: firstName,
      service: cleanService,
      area: cleanLocation,
      mins: 0,
      isReal: true,
      _timestamp: now,
    };
    recentRealLeads.unshift(publicLead);
    if (recentRealLeads.length > 20) {
      recentRealLeads.pop();
    }

    // --- EMAIL NOTIFICATION DELIVERY ---
    const recipientEmail = process.env.LEAD_RECIPIENT_EMAIL || 'Coolcomfortsolutions13@gmail.com';
    const emailApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'FridgeFix Hyderabad <onboarding@resend.dev>';

    let emailSent = false;
    let emailStatus = '';
    let emailError: string | null = null;

    const emailSubject = `New Service Lead - FridgeFix Hyderabad`;
    const emailPlainText = `
New Customer Lead - FridgeFix Hyderabad
=========================================

ID: ${newLead.id}
Name: ${newLead.name}
Phone: ${newLead.phone}
Email: ${newLead.email || 'N/A'}
Service: ${newLead.service}
Appliance: ${newLead.appliance || 'N/A'}
Brand: ${newLead.brand || 'N/A'}
Problem: ${newLead.problem || 'N/A'}
Location: ${newLead.location}, Hyderabad
Preferred Date: ${newLead.preferredDate || 'Earliest available'}
Message: ${newLead.message || 'None'}
Source Page: ${newLead.sourcePage}
Submitted At: ${new Date(newLead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
=========================================
`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: #0788C9; padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
    .body { padding: 24px; }
    .lead-badge { display: inline-block; background: #ECFDF5; color: #065F46; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    td.label { font-weight: bold; color: #64748b; width: 35%; }
    td.value { color: #0f172a; font-weight: 500; }
    .cta-box { margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px; text-align: center; border: 1px solid #bae6fd; }
    .cta-btn { display: inline-block; background: #0788C9; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 8px; }
    .footer { padding: 16px 24px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FridgeFix Hyderabad</h1>
      <p>Instant Customer Service Enquiry Notification</p>
    </div>
    <div class="body">
      <div class="lead-badge">⚡ New Lead Received • ${newLead.id}</div>
      <table>
        <tr><td class="label">Customer Name:</td><td class="value"><strong>${newLead.name}</strong></td></tr>
        <tr><td class="label">Mobile Phone:</td><td class="value"><a href="tel:${newLead.phone}" style="color:#0788C9; font-weight:bold;">${newLead.phone}</a></td></tr>
        <tr><td class="label">Email Address:</td><td class="value">${newLead.email ? `<a href="mailto:${newLead.email}">${newLead.email}</a>` : 'Not provided'}</td></tr>
        <tr><td class="label">Service Required:</td><td class="value"><strong>${newLead.service}</strong></td></tr>
        <tr><td class="label">Appliance Type:</td><td class="value">${newLead.appliance || 'Refrigerator'}</td></tr>
        <tr><td class="label">Brand:</td><td class="value">${newLead.brand || 'Any / All Brands'}</td></tr>
        <tr><td class="label">Location / Area:</td><td class="value"><strong>${newLead.location}, Hyderabad</strong></td></tr>
        <tr><td class="label">Preferred Date:</td><td class="value">${newLead.preferredDate || 'Earliest available visit'}</td></tr>
        <tr><td class="label">Reported Issue:</td><td class="value" style="color:#e11d48;">${newLead.problem || 'Not specified'}</td></tr>
        ${newLead.message ? `<tr><td class="label">Customer Note:</td><td class="value">${newLead.message}</td></tr>` : ''}
        <tr><td class="label">Page Source:</td><td class="value">${newLead.sourcePage}</td></tr>
        <tr><td class="label">Submitted At:</td><td class="value">${new Date(newLead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
      </table>
      <div class="cta-box">
        <p style="margin:0; font-size:13px; color:#0369a1;">Immediate customer response recommended within 15 minutes.</p>
        <a href="tel:${newLead.phone}" class="cta-btn">📞 Call Customer Now (${newLead.phone})</a>
      </div>
    </div>
    <div class="footer">
      FridgeFix Hyderabad • Refrigerator & Home Appliance Repair • 24×7 On Duty<br>
      Delivery target: ${recipientEmail}
    </div>
  </div>
</body>
</html>
`;

    if (emailApiKey) {
      try {
        const resend = new Resend(emailApiKey);
        const sendResult = await resend.emails.send({
          from: emailFrom,
          to: [recipientEmail],
          subject: emailSubject,
          text: emailPlainText,
          html: emailHtml,
        });

        if ((sendResult as any).error) {
          console.error('[Resend Error]:', (sendResult as any).error);
          emailError = (sendResult as any).error?.message || 'Email delivery failed';
          emailStatus = `Delivery error: ${emailError}`;
        } else {
          emailSent = true;
          emailStatus = `Lead successfully emailed to ${recipientEmail}`;
          console.log(`[Email Sent]: Lead ${newLead.id} dispatched to ${recipientEmail}`);
        }
      } catch (err: any) {
        console.error('[Resend Exception]:', err);
        emailError = err?.message || 'Failed to send email via Resend API';
        emailStatus = `Delivery failed: ${emailError}`;
      }
    } else {
      // Clear development notification log
      console.warn(`
[LEAD EMAIL NOTIFICATION]
Target: ${recipientEmail}
Note: EMAIL_API_KEY (or RESEND_API_KEY) is not configured in .env.
Payload logged below for verification:
----------------------------------------
${emailPlainText}
----------------------------------------
To send live transactional emails, add EMAIL_API_KEY to your environment secrets.
`);
      emailStatus = `Lead saved. Server configured to deliver to ${recipientEmail} (add EMAIL_API_KEY in Settings/Environment to activate live SMTP/Resend delivery).`;
    }

    return res.status(201).json({
      success: true,
      message: 'Your service request has been received! A verified technician will call you shortly.',
      leadId: newLead.id,
      emailSent,
      emailStatus,
      emailError,
      publicLead: {
        id: publicLead.id,
        name: publicLead.name,
        service: publicLead.service,
        area: publicLead.area,
        mins: 0,
      },
    });
  } catch (error: any) {
    console.error('Error handling lead submission:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your request. Please call our 24×7 helpline directly at 7416 225 140.',
    });
  }
};

app.post('/api/leads', handleLeadSubmission);
app.post('/api/submit-lead.php', handleLeadSubmission);
app.post('/api/submit-lead', handleLeadSubmission);

// Admin endpoints
app.get('/api/admin/leads', (_req: Request, res: Response) => {
  const leads = loadLeads();
  res.json({
    success: true,
    total: leads.length,
    newCount: leads.filter((l) => l.status === 'New').length,
    leads,
  });
});

app.patch('/api/admin/leads/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { status } = req.body;
  const leads = loadLeads();
  const leadIndex = leads.findIndex((l) => l.id === id);

  if (leadIndex === -1) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }

  leads[leadIndex].status = status;
  saveLeads(leads);

  return res.json({ success: true, lead: leads[leadIndex] });
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FridgeFix Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
