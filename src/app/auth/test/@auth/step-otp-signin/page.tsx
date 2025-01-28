import { CONFIG } from 'src/global-config';

import OtpSignInStep from "../../../../../auth/view/step-otp-sign-in";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <OtpSignInStep/>;
}
