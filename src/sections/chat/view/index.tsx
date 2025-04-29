'use client'

import {useQuery} from "@tanstack/react-query";

import {Chat} from "src/components/chat";

import {endpoints} from "../../../hooks/endPoints";
import {IApiChatHistory, IChat} from "../../../types/chat";
import {DashboardContent} from "../../../layouts/dashboard";
import {EditCreateRequest, GetRequest} from "../../../lib/axios";
import ChatSkeleton from "../../../components/Skeleton/chat-skeleton";
import LgAnimateLoading from "../../../components/loading-screen/animate";

// -------------------------------------------------------------------------------------------
const ChatView = () => {
  const {data, isPending} = useQuery({
    queryKey: ['get-chat-history'],
    queryFn: () => EditCreateRequest<any,IApiChatHistory>(endpoints.CHAT.CHAT_HISTORY,{},{},'post',{baseURL:'https://koochichat.liara.run'}),
  });
  return (<>
      {isPending ? <ChatSkeleton/> :
       <Chat title='' messages={data?.chats as IChat[]} />}
    </>
  );
};
export default ChatView;
