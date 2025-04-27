import { CONFIG } from 'src/global-config';

import FinancialRecords from "../../../../../../sections/profile/financial-records";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | پروفایل ` };

export default function Page() {
  return <FinancialRecords />;
}
