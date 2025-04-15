import { CONFIG } from 'src/global-config';

import StepResetPassword from 'src/auth/view/step-reset-password';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | تغییر رمز عبور ` };

export default function Page() {
  return <StepResetPassword />;
}
