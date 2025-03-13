'use client';

import {useSearchParams} from 'src/routes/hooks';

import {EmptyContent} from 'src/components/empty-content';

import {ChatLayout} from './layout';
import {ChatMessageList} from './chat-message-list';
import {ChatMessageInput} from './chat-message-input';

import type {ITicketResponse} from "../../types/tickets";

// ----------------------------------------------------------------------
type ChatType = {
  isTicket?: boolean,
  messages: ITicketResponse[]
}

export function Chat({isTicket = false, messages}: ChatType) {
  // const {user} = useMockedUser();
  //
  // const {contacts} = useGetContacts();

  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  // const {conversations, conversationsLoading} = useGetConversations();
  // const {conversation, conversationError, conversationLoading} =
  //   useGetConversation(selectedConversationId);

  // const roomNav = useCollapseNav();
  //
  // const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  // useEffect(() => {
  //   if (!selectedConversationId) {
  //     startTransition(() => {
  //       router.push(paths.dashboard.root);
  //     });
  //   }
  // }, [conversationError, router, selectedConversationId]);

  // const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
  //   setRecipients(selected);
  // }, []);
  //
  // const filteredParticipants: IChatParticipant[] = conversation
  //   ? conversation.participants.filter(
  //     (participant: IChatParticipant) => participant.id !== `${user?.id}`
  //   )
  //   : [];
  const hasConversation = messages?.length > 0;
  console.log(messages)
  return (
    <ChatLayout
      slots={{
        // header: hasConversation ? (
        //   <ChatHeaderDetail
        //     collapseNav={roomNav}
        //     participants={filteredParticipants}
        //     loading={conversationLoading}
        //   />
        // ) : (
        //   <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients}/>
        // ),
        header:null,
        nav: null,
        main: (
          <>
            {messages?.length > 0 ? (
              <ChatMessageList
                messages={messages ?? []}
                // participants={filteredParticipants}
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
