import { sendEmail, MailOptions } from './mailer';

export interface EmailConfirmationData {
  email: string;
  verificationCode: string;
  userName?: string;
}

/**
 * Send verification code email to user
 */
export async function sendVerificationEmail(data: EmailConfirmationData): Promise<boolean> {
  try {
    const { email, verificationCode, userName } = data;
    
    const subject = 'Verify Your Email Address';
    const html = generateVerificationEmailHTML(verificationCode, userName);
    const text = generateVerificationEmailText(verificationCode, userName);

    const mailOptions: MailOptions = {
      to: email,
      subject,
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
      return true;
    } else {
      console.error(`❌ Failed to send verification email to ${email}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return false;
  }
}

/**
 * Generate HTML version of verification email
 */
function generateVerificationEmailHTML(verificationCode: string, userName?: string): string {
  const greeting = userName ? `Hello ${userName},` : 'Hello,';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .email-wrapper {
          padding: 40px 20px;
          max-width: 600px;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #34495e;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        .verification-section {
          text-align: center;
          margin: 40px 0;
        }
        .verification-label {
          font-size: 14px;
          color: #7f8c8d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .verification-code {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
          border: 3px solid #667eea;
          border-radius: 12px;
          padding: 25px;
          margin: 20px 0;
          position: relative;
          overflow: hidden;
        }
        .verification-code::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .code {
          font-size: 36px;
          font-weight: 700;
          color: #667eea;
          letter-spacing: 8px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
        }
        .expiry-notice {
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border-left: 4px solid #e53e3e;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          font-size: 15px;
          color: #c53030;
        }
        .expiry-notice strong {
          color: #e53e3e;
        }
        .warning {
          background: linear-gradient(135deg, #fefcbf 0%, #fed7aa 100%);
          border: 1px solid #f6ad55;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          color: #c05621;
          position: relative;
        }
        .warning::before {
          content: '🔒';
          font-size: 20px;
          margin-right: 8px;
        }
        .warning strong {
          color: #c05621;
        }
        .support-note {
          background: #f7fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          color: #4a5568;
          font-size: 15px;
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
          .code {
            font-size: 28px;
            letter-spacing: 6px;
          }
          .logo {
            font-size: 24px;
          }
          .header h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">HRS App</div>
            <h1>Verify Your Email</h1>
          </div>
          
          <div class="content">
            <div class="greeting">${greeting}</div>
            
            <div class="message">
              Thank you for signing up! We're excited to have you on board. To complete your registration and secure your account, please use the verification code below:
            </div>
            
            <div class="verification-section">
              <div class="verification-label">Your Verification Code</div>
              <div class="verification-code">
                <div class="code">${verificationCode}</div>
              </div>
            </div>
            
            <div class="expiry-notice">
              ⏰ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your verification code.
            </div>
            
            <div class="support-note">
              If you didn't request this verification code, please ignore this email or contact our support team immediately.
            </div>
            
            <div class="divider"></div>
            
            <div class="signature">
              <strong>Best regards,</strong><br>
              The HRS App Team
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} HRS App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of verification email
 */
function generateVerificationEmailText(verificationCode: string, userName?: string): string {
  const greeting = userName ? `Hello ${userName},` : 'Hello,';
  
  return `
${greeting}

Thank you for signing up! We're excited to have you on board. To complete your registration and secure your account, please use the verification code below:

VERIFICATION CODE: ${verificationCode}

⏰ IMPORTANT: This code will expire in 10 minutes for security reasons.

🔒 SECURITY NOTICE: Never share this code with anyone. Our team will never ask for your verification code.

If you didn't request this verification code, please ignore this email or contact our support team immediately.

Best regards,
The HRS App Team

---
This is an automated message, please do not reply to this email.
© ${new Date().getFullYear()} HRS App. All rights reserved.
  `.trim();
}

/**
 * Send verification email with simplified interface
 */
export async function sendVerificationCode(email: string, code: string, userName?: string): Promise<boolean> {
  return sendVerificationEmail({ email, verificationCode: code, userName });
}