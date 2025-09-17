import { verifyPassword } from '@/utils/bycript/password';
import { User } from '@/models/associationt.ts/association';

type LoginAttemptSuccess = {
  success: true;
  user: Record<string, any>;
};

type LoginAttemptFailure = {
  success: false;
  error: string;
};

export type LoginAttemptResult = LoginAttemptSuccess | LoginAttemptFailure;

export async function loginAttempt(email: string, password: string): Promise<LoginAttemptResult> {
  const userInstance = await User().findOne({ where: { email } });
  if (!userInstance) {
    return { success: false, error: 'User not found with this email address' };
  }
 
  const userPlain = userInstance.get({ plain: true }) as Record<string, any>;
 
  const isMatch = await verifyPassword(password, userPlain.password);
  if (!isMatch) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Prepare safe user object (remove sensitive fields)
  const { password: _removedPassword, ...safeUser } = userPlain;

  return {
    success: true,
    user: safeUser,
  };
}


