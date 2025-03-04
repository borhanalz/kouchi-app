import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import StepPhoneNumber from 'src/auth/view/step-phoneNumber';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <StepPhoneNumber />;
}
