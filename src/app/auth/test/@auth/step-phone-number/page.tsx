import Typography from "@mui/material/Typography";

import { CONFIG } from 'src/global-config';

import { JwtSignUpView } from 'src/auth/view/jwt';
import StepPhoneNumber from "../../../../../auth/view/step-phoneNumber";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <StepPhoneNumber/>;
}
