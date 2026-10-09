// Vercel Serverless API Route for Wedding RSVP Submissions
// Endpoint: POST /api/rsvp

const RECIPIENTS = [
  'portantewilfredo@gmail.com',
  'shengseat27@gmail.com',
  'romnicksiano2@gmail.com'
];

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please submit via POST.'
    });
  }

  try {
    // Parse JSON or Form payload
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    const name = (body?.name || body?.Name || '').toString().trim();
    const plusOne = (body?.plusOne || body?.['Plus One'] || '').toString().trim();
    const attending = (body?.attending || body?.Attending || '').toString().trim();

    // --- BACKEND VALIDATION ---
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Full name is required.'
      });
    }

    if (name.length > 120) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Name exceeds maximum length of 120 characters.'
      });
    }

    if (!attending) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Attending status is required.'
      });
    }

    const normAttending = attending.toLowerCase();
    const isValidStatus =
      normAttending.includes('yes') ||
      normAttending.includes('joyfully') ||
      normAttending.includes('no') ||
      normAttending.includes('regrettably') ||
      normAttending.includes('attending') ||
      normAttending.includes('declining');

    if (!isValidStatus) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Invalid attendance response option.'
      });
    }

    const isAttending = normAttending.includes('yes') || normAttending.includes('attending') || normAttending.includes('joyfully');
    const statusLabel = isAttending ? 'Attending (Yes, joyfully!)' : 'Declining (No, regrettably.)';

    const emailSubject = `💍 Wedding RSVP: ${name} - ${isAttending ? 'Attending' : 'Declining'}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f8fb; margin: 0; padding: 20px; color: #192838; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #d0e1fd; box-shadow: 0 4px 20px rgba(25, 40, 56, 0.08); }
    .header { font-family: Georgia, serif; color: #192838; font-size: 24px; border-bottom: 2px solid #75a8cd; padding-bottom: 12px; margin-top: 0; }
    .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .table td { padding: 14px; border-bottom: 1px solid #e6ecef; font-size: 15px; }
    .label { font-weight: 600; color: #4e8cb9; width: 35%; }
    .val { font-weight: 600; color: #192838; }
    .status-tag { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; }
    .status-yes { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
    .status-no { background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .footer { margin-top: 24px; padding: 14px; background: #f4f8fb; border-radius: 8px; font-size: 12px; color: #64748b; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <h2 class="header">💌 New Wedding RSVP Submission</h2>
    <p style="font-size: 15px; color: #4b5563;">You have received a new response for <strong>Wilfredo & Sheila's Wedding</strong>:</p>
    
    <table class="table">
      <tr>
        <td class="label">Guest Name</td>
        <td class="val">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td class="label">Attendance Response</td>
        <td>
          <span class="status-tag ${isAttending ? 'status-yes' : 'status-no'}">
            ${isAttending ? '✓ Attending (Yes, joyfully!)' : '✗ Declining (No, regrettably.)'}
          </span>
        </td>
      </tr>
      <tr>
        <td class="label">Plus One / Guest</td>
        <td style="color: #334155; font-weight: 500;">${plusOne ? escapeHtml(plusOne) : '<em>None specified</em>'}</td>
      </tr>
      <tr>
        <td class="label">Received At</td>
        <td style="color: #64748b;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (PST)</td>
      </tr>
    </table>

    <div class="footer">
      <strong>Notification Recipients:</strong><br>
      • portantewilfredo@gmail.com<br>
      • shengseat27@gmail.com<br>
      • romnicksiano2@gmail.com
    </div>
  </div>
</body>
</html>
    `;

    const textBody = `NEW WEDDING RSVP RESPONSE\n\nGuest Name: ${name}\nAttendance: ${statusLabel}\nPlus One: ${plusOne || 'None specified'}\nSubmitted At: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (PST)\n\nRecipients:\n- ${RECIPIENTS.join('\n- ')}`;

    let emailSent = false;
    let providerName = null;
    let emailErrorMsg = null;

    // --- 1. RESEND API DELIVERY (Preferred for Vercel) ---
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Wedding RSVP <onboarding@resend.dev>';
        
        // Send to recipients
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: RECIPIENTS,
            subject: emailSubject,
            html: htmlBody,
            text: textBody
          })
        });

        const resendResult = await resendResponse.json();
        if (resendResponse.ok) {
          emailSent = true;
          providerName = 'Resend API';
          console.log('[RSVP Success] Resend email dispatched:', resendResult);
        } else {
          // If bulk sending failed (e.g. Resend free tier unverified domain restriction), try sending to each recipient individually
          console.warn('[RSVP Warning] Bulk Resend send failed, attempting individual sends:', resendResult);
          emailErrorMsg = resendResult.message || JSON.stringify(resendResult);

          for (const recipient of RECIPIENTS) {
            try {
              const indivRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  from: fromEmail,
                  to: recipient,
                  subject: emailSubject,
                  html: htmlBody,
                  text: textBody
                })
              });
              if (indivRes.ok) {
                emailSent = true;
                providerName = 'Resend API (Individual)';
              }
            } catch (indivErr) {
              console.error(`[Resend Error for ${recipient}]:`, indivErr);
            }
          }
        }
      } catch (err) {
        emailErrorMsg = err.message;
        console.error('[RSVP Error] Resend fetch exception:', err);
      }
    }

    // --- 2. NODEMAILER / GMAIL SMTP DELIVERY ---
    if (!emailSent && (process.env.SMTP_HOST || process.env.SMTP_USER)) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `Wedding RSVP <${process.env.SMTP_USER}>`,
          to: RECIPIENTS.join(', '),
          subject: emailSubject,
          html: htmlBody,
          text: textBody
        });

        emailSent = true;
        providerName = 'Nodemailer SMTP';
        console.log('[RSVP Success] Nodemailer SMTP email sent to all recipients');
      } catch (err) {
        emailErrorMsg = emailErrorMsg || err.message;
        console.error('[RSVP Error] Nodemailer SMTP exception:', err);
      }
    }

    // --- 3. FORMSPREE ENDPOINT DELIVERY ---
    if (!emailSent && process.env.FORMSPREE_ENDPOINT) {
      try {
        const formspreeResponse = await fetch(process.env.FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            guestName: name,
            attendingStatus: statusLabel,
            plusOne: plusOne || 'None specified',
            _subject: emailSubject,
            notificationRecipients: RECIPIENTS.join(', ')
          })
        });

        if (formspreeResponse.ok) {
          emailSent = true;
          providerName = 'Formspree Endpoint';
          console.log('[RSVP Success] Formspree notification dispatched');
        } else {
          const fsData = await formspreeResponse.json().catch(() => ({}));
          emailErrorMsg = emailErrorMsg || fsData.error || 'Formspree request failed';
        }
      } catch (err) {
        emailErrorMsg = emailErrorMsg || err.message;
      }
    }

    // --- 4. ERROR HANDLING IF NO EMAIL PROVIDER WORKED ---
    if (!emailSent) {
      console.error('❌ [RSVP ERROR] No email service succeeded in dispatching email notification.', {
        guestName: name,
        attending: statusLabel,
        plusOne: plusOne || 'None',
        recipients: RECIPIENTS,
        lastError: emailErrorMsg
      });

      return res.status(500).json({
        success: false,
        error: `Email notification delivery failed: Please configure your email service API key (RESEND_API_KEY, FORMSPREE_ENDPOINT, or Gmail SMTP) in Vercel Environment Variables.`
      });
    }

    // --- 5. SUCCESS RESPONSE (ONLY RETURNED WHEN EMAIL DISPATCH SUCCEEDED) ---
    return res.status(200).json({
      success: true,
      message: 'RSVP confirmed and email notification sent!',
      details: {
        guestName: name,
        attending: statusLabel,
        plusOne: plusOne || 'None specified',
        deliveryMethod: providerName
      }
    });

  } catch (err) {
    console.error('[RSVP Fatal Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your RSVP submission.'
    });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
