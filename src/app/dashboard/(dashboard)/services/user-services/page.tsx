import { CONFIG } from 'src/global-config';

import TicketsView from "../../../../../sections/tickets/view/tickets-view";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  بسته های کوچی ` };

export default function Page() {
  return <TicketsView isProServices />;
}
