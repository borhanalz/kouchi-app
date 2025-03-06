'use client';

import type {IChatParticipant} from 'src/types/chat-component';

import {useForm} from "react-hook-form";
import {useState, useCallback} from 'react';

import Stack from "@mui/material/Stack";

import {useRouter, useSearchParams} from 'src/routes/hooks';

import {useGetContacts, useGetConversation, useGetConversations} from 'src/actions/chat';

import {EmptyContent} from 'src/components/empty-content';

import {useMockedUser} from 'src/auth/hooks';

import {ChatLayout} from './layout';
import {Form, Field} from "../hook-form";
import {ChatMessageList} from './chat-message-list';
import {ChatMessageInput} from './chat-message-input';
import {ChatHeaderDetail} from './chat-header-detail';
import {ChatHeaderCompose} from './chat-header-compose';
import {useCollapseNav} from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------
type ChatType = {
  isTicket?: boolean
}
const data:any = [
  {
    "responderType": "user",
    "responderName": "test",
    "text": "zarinpal",
    "attachments": [],
    "createdAt": "2025-03-04T21:53:33.728Z"
  }
]
export function Chat({isTicket = false}: ChatType) {
  const router = useRouter();

  const {user} = useMockedUser();

  const {contacts} = useGetContacts();

  const methods = useForm();

  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  const {conversations, conversationsLoading} = useGetConversations();
  const {conversation, conversationError, conversationLoading} =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();
  const conversationsNav = useCollapseNav();

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
            {data ? (
              conversationError ? (
                <EmptyContent title={conversationError.message}/>
              ) : (
                <ChatMessageList
                  messages={data ?? []}
                  participants={filteredParticipants}
                  loading={conversationLoading}
                />
              )
            ) : (
              isTicket ? <Stack sx={{height: '100%'}}>
                <Form methods={methods}>
                  <Stack spacing={2} p={2}>
                    <Field.Text name="title" label="عنوان تیکت: مثلا درخواست چک کردن مدارک"/>
                  </Stack>
                </Form>
              </Stack> : <EmptyContent
                title="خوش آمدید !"
                description="برای شروع گفت و گو با کوچی لطفا پیامی ارسال کنید"
              />
            )}

            <ChatMessageInput
              recipients={recipients}
              onAddRecipients={handleAddRecipients}
              selectedConversationId={selectedConversationId}
              disabled={!recipients.length && !selectedConversationId}
            />
          </>
        ),
        details: hasConversation && null,
      }}
    />
  );
}
