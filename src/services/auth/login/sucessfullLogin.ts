import { saveTheAttempt } from "./saveTheAttempt";
import { sendLoginAttemptEmail } from "./loginAttemptMail";

type SuccessfulLoginResult = {
  success: boolean;
  savedAttempt?: any;
  emailSent: boolean;
  errors?: string[];
};

export async function sucessfullLogin(
  userId: number, 
  userEmail: string, 
  reasonFailed: string | null, 
  ip: string, 
  userAgent: string
): Promise<SuccessfulLoginResult> {
  
  const result: SuccessfulLoginResult = {
    success: true,
    emailSent: false,
    errors: []
  };

  try {
    // Validate input parameters
    if (!userId || !userEmail || !ip || !userAgent) {
      result.success = false;
      result.errors?.push('Missing required parameters');
      return result;
    }

    if (!userEmail.includes('@')) {
      result.success = false;
      result.errors?.push('Invalid email format');
      return result;
    }

    // Save login attempt to database
    const saveResult = await saveTheAttempt({
      userId: userId,
      userEmail: userEmail,
      success: true,
      reasonFailed: reasonFailed || undefined,
      ip: ip,
      userAgent: userAgent
    });

    // Handle database save result
    if (!saveResult.success) {
      result.success = false;
      result.errors?.push(...(saveResult.errors || []));
      console.error('Failed to save login attempt:', saveResult.errors);
    } else {
      result.savedAttempt = saveResult.savedAttempt;
    }

    // Send email notification (only if database save was successful)
    if (result.success && result.savedAttempt) {
      try {
        await sendLoginAttemptEmail({
          email: userEmail, 
          ip: ip, 
          location: result.savedAttempt.location || 'Unknown', 
          timestamp: result.savedAttempt.attemptAt || new Date(), 
          userAgent: userAgent
        });
        result.emailSent = true;
      } catch (emailError) {
        console.error('Failed to send login attempt email:', emailError);
        result.errors?.push('Email notification failed');
        // Don't fail the entire operation if email fails
        // result.success = false;
      }
    }

  } catch (error) {
    console.error('Unexpected error in sucessfullLogin:', error);
    result.success = false;
    result.errors?.push('Unexpected error occurred');
  }

  return result;
}