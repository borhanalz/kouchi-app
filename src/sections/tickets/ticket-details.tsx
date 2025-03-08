'use client'

import {Chat} from "src/components/chat";

import {DashboardContent} from "../../layouts/dashboard";
import {useQuery} from "@tanstack/react-query";
import {EditCreateRequest} from "../../lib/axios";
import {endpoints} from "../../hooks/endPoints";
import {IApiGetTicket, ITicketResponse} from "../../types/tickets";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import ChatSkeleton from "../../components/Skeleton/chat-skeleton";

// -------------------------------------------------------------------------------------------
interface ITicketDetail {
  ticketId: string;
}

const TicketDetail = ({ticketId}: ITicketDetail) => {
  const {data, isPending} = useQuery({
    queryKey: ['get-ticket-by-id'],
    queryFn: () => EditCreateRequest<ITicketDetail, IApiGetTicket>(endpoints.TICKETS.GET_BY_ID, {ticketId})
  });
  return (
    <DashboardContent
      maxWidth={false}
      sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
      title="تیکت"
    >
      {isPending ? <ChatSkeleton/> :
        <Chat messages={data?.ticket.responses as ITicketResponse[]} isTicket/>}
    </DashboardContent>
  );
};
export default TicketDetail;
