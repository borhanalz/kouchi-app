'use client'

import {Chat} from "src/components/chat";

import {DashboardContent} from "../../layouts/dashboard";
// -------------------------------------------------------------------------------------------
type ticketDetailType = {
  ticketId: string;
}
const TicketDetail = ({ticketId}:ticketDetailType) => {
  console.log(ticketId)
  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      title="تیکت"
    >
      <Chat isTicket/>
    </DashboardContent>
  );
};
export default TicketDetail;
