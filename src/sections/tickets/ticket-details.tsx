'use client'

import {useQuery} from "@tanstack/react-query";

import {Chat} from "src/components/chat";

import {endpoints} from "../../hooks/endPoints";
import {EditCreateRequest} from "../../lib/axios";
import {DashboardContent} from "../../layouts/dashboard";
import {AgentType, IApiGetTicket, type ITicketFormData, ITicketResponse} from "../../types/tickets";
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
  console.log(data)
  return (<>
      {isPending ? <ChatSkeleton/> :
        <Chat title={data?.ticket?.title as string}
              assignmentInfo={data?.ticket?.assignmentHistory[0]?.agent as AgentType}
              messages={data?.ticket.responses as ITicketResponse[]} IsTicket/>}
    </>
  );
};
export default TicketDetail;
