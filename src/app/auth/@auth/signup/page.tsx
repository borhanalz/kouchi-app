import { CONFIG } from 'src/global-config';

import StepSignUp from "src/auth/view/step-register";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <StepSignUp/>;
}
