import { CONFIG } from 'src/global-config';

import StepSignUp from 'src/auth/view/step-register';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | ثبت نام ` };

export default function Page() {
  return <StepSignUp />;
}
