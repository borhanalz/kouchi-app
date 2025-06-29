'use client'

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { Chat } from "src/components/chat";

import { endpoints } from "../../../hooks/endPoints";
import { EditCreateRequest } from "../../../lib/axios";
import { IApiChatHistory, IChat } from "../../../types/chat";
import ChatSkeleton from "../../../components/Skeleton/chat-skeleton";

const ChatView = () => {
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState<IChat[]>([]);
  const [deactiveMoreMessageButton, setDeactiveMoreMessageButton] = useState(true);

  const { data, isLoading, isFetching }: any = useQuery({
    queryKey: ['get-chat-history', page],
    queryFn: () =>
      EditCreateRequest<any, IApiChatHistory>(
        endpoints.CHAT.CHAT_HISTORY,
        { page, limit: 10 },
        {},
        'post',
        { baseURL: 'https://koochichatdev.liara.run' }
      ),
  });
  useEffect(() => {
    if (data?.chats?.length) {
      // ✅ Just use the full message list from backend
      setAllMessages(data.chats);

      // ✅ Control the "More messages" button
      setDeactiveMoreMessageButton(!data.pagination?.hasNextPage);
    }
  }, [data?.chats]);
  console.log(data)
  const handleAddMoreMessage = () => {
    if (!data?.pagination?.hasNextPage) return;
    setPage(prev => prev + 1);
  };

  console.log("messages from backend:", data?.chats?.length);
  console.log("messages shown in state:", allMessages.length);

  return (
    <>
      {isLoading && page === 1 ? (
        <ChatSkeleton />
      ) : (
        <>
          <Chat
            handleAddMoreMeesage={handleAddMoreMessage}
            title=""
            refetch
            messages={allMessages}
            deactiveMoreMessageButton={deactiveMoreMessageButton}
          />
          {isFetching && page > 1 && (
            <div className="text-center py-2 text-sm text-gray-500">
              در حال بارگذاری پیام‌های بیشتر...
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ChatView;

