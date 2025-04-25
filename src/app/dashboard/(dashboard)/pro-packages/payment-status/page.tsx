import { CONFIG } from 'src/global-config';

import ProPackagesSuccessfullPayment from '../../../../../sections/pro-packages/pro-packages-successfull-payment';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  بسته های کوچی ` };

export default function Page() {
  return <ProPackagesSuccessfullPayment />;
}
