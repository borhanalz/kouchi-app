import { CONFIG } from 'src/global-config';

import TicketDetail from "../../../../../sections/tickets/ticket-details";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  تیکت ` };

export default function Page({ params }: { params: { 'ticket-id': string } }) {
  return <TicketDetail ticketId={params['ticket-id']} />;
}
