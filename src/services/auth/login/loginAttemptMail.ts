import { sendEmail } from '@/utils/email/mailer';

type LoginAttemptEmailData = {
  email: string;
  ip: string;
  location: string;
  timestamp: Date;
  userAgent?: string;
};

export async function sendLoginAttemptEmail(data: LoginAttemptEmailData): Promise<void> {
  try {
    const formattedDate = data.timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Login Attempt Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .alert { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔐 Login Attempt Notification</h2>
          </div>
          
          <div class="alert">
            <strong>⚠️ Security Alert:</strong> A login attempt was made on your account.
          </div>
          
          <div class="details">
            <h3>Login Attempt Details:</h3>
            <p><strong>Time:</strong> ${formattedDate}</p>
            <p><strong>IP Address:</strong> ${data.ip}</p>
            <p><strong>Location:</strong> ${data.location || 'Unknown'}</p>
            ${data.userAgent ? `<p><strong>Device:</strong> ${data.userAgent}</p>` : ''}
          </div>
          
          <div class="alert">
            <strong>💡 What you should do:</strong>
            <ul>
              <li>If this was you, you can safely ignore this email</li>
              <li>If this wasn't you, please change your password immediately</li>
              <li>Consider enabling two-factor authentication for extra security</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated security notification from your account system.</p>
            <p>If you have any concerns, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Login Attempt Notification

Security Alert: A login attempt was made on your account.

Login Attempt Details:
- Time: ${formattedDate}
- IP Address: ${data.ip}
- Location: ${data.location || 'Unknown'}
${data.userAgent ? `- Device: ${data.userAgent}` : ''}

What you should do:
- If this was you, you can safely ignore this email
- If this wasn't you, please change your password immediately
- Consider enabling two-factor authentication for extra security

This is an automated security notification from your account system.
If you have any concerns, please contact our support team.
    `;

    await sendEmail({
      to: data.email,
      subject: '🔐 Login Attempt Notification - Security Alert',
      text: textContent,
      html: htmlContent,
    });

  } catch (error) {
    console.error('Failed to send login attempt email:', error);
    // Don't throw error to avoid breaking the login flow
  }
}
