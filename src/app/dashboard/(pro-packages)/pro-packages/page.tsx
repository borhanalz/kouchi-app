import { CONFIG } from 'src/global-config';

import ProPackages from 'src/sections/pro-packages/view/pro-packages';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  بسته های کوچی ` };

export default function Page() {
  return <ProPackages />;
}
