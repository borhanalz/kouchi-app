'use client';

import type {IChatParticipant} from 'src/types/chat-component';

import {useForm} from "react-hook-form";
import {useState, useCallback} from 'react';

import {useSearchParams} from 'src/routes/hooks';

import {useGetContacts, useGetConversation, useGetConversations} from 'src/actions/chat';

import {EmptyContent} from 'src/components/empty-content';

import {useMockedUser} from 'src/auth/hooks';

import {ChatLayout} from './layout';
import {ChatMessageList} from './chat-message-list';
import {ChatMessageInput} from './chat-message-input';
import {ChatHeaderDetail} from './chat-header-detail';
import {ChatHeaderCompose} from './chat-header-compose';
import {useCollapseNav} from './hooks/use-collapse-nav';

import type {ITicketResponse} from "../../types/tickets";

// ----------------------------------------------------------------------
type ChatType = {
  isTicket?: boolean,
  messages: ITicketResponse[]
}

export function Chat({isTicket = false, messages}: ChatType) {
  const {user} = useMockedUser();

  const {contacts} = useGetContacts();

  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  const {conversations, conversationsLoading} = useGetConversations();
  const {conversation, conversationError, conversationLoading} =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  // useEffect(() => {
  //   if (!selectedConversationId) {
  //     startTransition(() => {
  //       router.push(paths.dashboard.root);
  //     });
  //   }
  // }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
    setRecipients(selected);
  }, []);

  const filteredParticipants: IChatParticipant[] = conversation
    ? conversation.participants.filter(
      (participant: IChatParticipant) => participant.id !== `${user?.id}`
    )
    : [];
  const hasConversation = selectedConversationId && conversation;
  return (
    <ChatLayout
      slots={{
        header: hasConversation ? (
          <ChatHeaderDetail
            collapseNav={roomNav}
            participants={filteredParticipants}
            loading={conversationLoading}
          />
        ) : (
          <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients}/>
        ),
        nav: null,
        main: (
          <>
            {messages?.length > 0 ? (
              <ChatMessageList
                messages={messages ?? []}
                // participants={filteredParticipants}
                loading={conversationLoading}
              />
            ) : (
              <EmptyContent
                title="خوش آمدید !"
                description="لطفا تیکت خود را ایحاد کنید."
              />
            )}
            <ChatMessageInput
              isNewTicket={messages?.length<1}
              // recipients={recipients}
              // onAddRecipients={handleAddRecipients}
              // selectedConversationId={selectedConversationId}
              // disabled={!recipients.length && !selectedConversationId}
            />
          </>
        ),
        details: hasConversation && null,
      }}
    />
  );
}
