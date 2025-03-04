import { CONFIG } from 'src/global-config';

import CreateTicket from "src/sections/tickets/tickets-create";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  تیکت ` };

export default function Page() {
  return <CreateTicket />;
}
