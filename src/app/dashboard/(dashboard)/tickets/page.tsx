import { CONFIG } from 'src/global-config';

import TicketView from 'src/sections/tickets/view/tickets-view';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  نقشه راه ` };

export default function Page() {
  return <TicketView />;
}
