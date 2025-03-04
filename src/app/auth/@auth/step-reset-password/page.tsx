import { CONFIG } from 'src/global-config';

import StepResetPassword from 'src/auth/view/step-reset-password';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <StepResetPassword />;
}
