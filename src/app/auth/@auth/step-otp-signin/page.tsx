import { CONFIG } from 'src/global-config';

import OtpSignInStep from 'src/auth/view/step-otp-sign-in';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | ورود با رمز یکبار مصرف ` };

export default function Page() {
  return <OtpSignInStep />;
}
