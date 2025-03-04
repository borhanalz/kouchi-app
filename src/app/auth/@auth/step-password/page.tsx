import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import StepPassword from 'src/auth/view/step-password';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <StepPassword />;
}
