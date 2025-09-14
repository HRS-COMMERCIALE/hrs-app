import { sendEmail, MailOptions } from './mailer';
import { companyInfo } from '../../lib/config/companyInfo';

export interface ContactUsData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Send contact form email to company
 */
export async function sendContactUsEmail(data: ContactUsData): Promise<boolean> {
  try {
    const { name, email, subject, message } = data;
    
    const emailSubject = `New Contact Form Submission: ${subject}`;
    const html = generateContactUsEmailHTML(data);
    const text = generateContactUsEmailText(data);

    const mailOptions: MailOptions = {
      to: companyInfo.contact.email.value,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const result = await sendEmail(mailOptions);
    
    if (result.messageId) {
      console.log(`✅ Contact form email sent successfully to ${companyInfo.contact.email.value}`);
      return true;
    } else {
      console.error(`❌ Failed to send contact form email to ${companyInfo.contact.email.value}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    return false;
  }
}

/**
 * Generate HTML version of contact form email
 */
function generateContactUsEmailHTML(data: ContactUsData): string {
  const { name, email, subject, message } = data;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #3c959d 0%, #4ba5ad 50%, #ef7335 100%);
          min-height: 100vh;
        }
        .email-wrapper {
          padding: 40px 20px;
          max-width: 700px;
          margin: 0 auto;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }
        .header {
          background: linear-gradient(135deg, #3c959d 0%, #4ba5ad 50%, #ef7335 100%);
          padding: 40px 40px 60px;
          text-align: center;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
          padding: 50px 40px 40px;
        }
        .alert-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-block;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .contact-info {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          border-left: 4px solid #3c959d;
        }
        .info-row {
          display: flex;
          margin-bottom: 15px;
          align-items: center;
        }
        .info-label {
          font-weight: 600;
          color: #2c3e50;
          min-width: 120px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: #34495e;
          font-size: 16px;
          flex: 1;
        }
        .message-section {
          background: #f7fafc;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          border: 1px solid #e2e8f0;
        }
        .message-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .message-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 16px;
          line-height: 1.7;
          color: #34495e;
          white-space: pre-wrap;
        }
        .action-buttons {
          text-align: center;
          margin: 40px 0;
        }
        .btn {
          display: inline-block;
          padding: 15px 30px;
          margin: 0 10px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .btn-primary {
          background: linear-gradient(135deg, #3c959d 0%, #4ba5ad 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(60, 149, 157, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(60, 149, 157, 0.4);
        }
        .btn-secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }
        .btn-secondary:hover {
          background: #edf2f7;
        }
        .signature {
          margin-top: 40px;
          padding-top: 20px;
          font-size: 16px;
          color: #2c3e50;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px 40px;
          text-align: center;
          color: #6c757d;
          font-size: 13px;
          border-top: 1px solid #e9ecef;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e9ecef, transparent);
          margin: 30px 0;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header, .content {
            padding-left: 20px;
            padding-right: 20px;
          }
          .info-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .info-label {
            min-width: auto;
            margin-bottom: 5px;
          }
          .btn {
            display: block;
            margin: 10px 0;
            width: 100%;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">${companyInfo.name}</div>
            <h1>New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div class="alert-badge">📧 New Message Received</div>
            
            <div class="contact-info">
              <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">
                  <a href="mailto:${email}" style="color: #3c959d; text-decoration: none;">${email}</a>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">Subject:</div>
                <div class="info-value">${subject}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>
            
            <div class="message-section">
              <div class="message-label">Message:</div>
              <div class="message-content">${message}</div>
            </div>
            
            <div class="action-buttons">
              <a href="mailto:${email}?subject=Re: ${subject}" class="btn btn-primary">
                Reply to ${name}
              </a>
              <a href="mailto:${email}" class="btn btn-secondary">
                Send Email
              </a>
            </div>
            
            <div class="divider"></div>
            
            <div class="signature">
              <strong>Best regards,</strong><br>
              The ${companyInfo.name} Team
            </div>
          </div>
          
          <div class="footer">
            <p>This email was automatically generated from your website contact form.</p>
            <p>© ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of contact form email
 */
function generateContactUsEmailText(data: ContactUsData): string {
  const { name, email, subject, message } = data;
  
  return `
NEW CONTACT FORM SUBMISSION
============================

Name: ${name}
Email: ${email}
Subject: ${subject}
Date: ${new Date().toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

MESSAGE:
--------
${message}

============================
Reply to: ${email}
Subject: Re: ${subject}

Best regards,
The ${companyInfo.name} Team

---
This email was automatically generated from your website contact form.
© ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.
  `.trim();
}

/**
 * Send contact form email with simplified interface
 */
export async function sendContactFormEmail(name: string, email: string, subject: string, message: string): Promise<boolean> {
  return sendContactUsEmail({ name, email, subject, message });
}
