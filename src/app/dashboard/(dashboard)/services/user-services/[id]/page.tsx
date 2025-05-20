import { CONFIG } from 'src/global-config';

import TicketDetail from "../../../../../../sections/tickets/ticket-details";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  تیکت ` };

export default function Page({ params }: { params: { 'id': string } }) {
  return <TicketDetail isProService ticketId={params['id']} />;
}
