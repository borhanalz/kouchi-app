'use client'

import type { IChatParticipant } from 'src/types/chat';

import { useState, useEffect, useCallback, startTransition } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetContacts, useGetConversation, useGetConversations } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';

import { ChatLayout } from './layout';
import { ChatMessageList } from './chat-message-list';
import { ChatMessageInput } from './chat-message-input';
import { ChatHeaderDetail } from './chat-header-detail';
import { ChatHeaderCompose } from './chat-header-compose';
import { useCollapseNav } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function Chat() {
  const router = useRouter();

  const { user } = useMockedUser();

  const { contacts } = useGetContacts();

  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  const { conversations, conversationsLoading } = useGetConversations();
  const { conversation, conversationError, conversationLoading } =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();
  const conversationsNav = useCollapseNav();

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  useEffect(() => {
    if (!selectedConversationId) {
      startTransition(() => {
        router.push(paths.dashboard.root);
      });
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
    setRecipients(selected);
  }, []);

  const filteredParticipants: IChatParticipant[] = conversation
    ? conversation.participants.filter(
      (participant: IChatParticipant) => participant.id !== `${user?.id}`
    )
    : [];

  const hasConversation = selectedConversationId && conversation;

  return ( <ChatLayout
        slots={{
          header: hasConversation ? (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={filteredParticipants}
              loading={conversationLoading}
            />
          ) : (
            <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
          ),
          nav: (
            null
          ),
          main: (
            <>
              {selectedConversationId ? (
                conversationError ? (
                  <EmptyContent
                    title={conversationError.message}
                  />
                ) : (
                  <ChatMessageList
                    messages={conversation?.messages ?? []}
                    participants={filteredParticipants}
                    loading={conversationLoading}
                  />
                )
              ) : (
                <EmptyContent
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
          details: hasConversation && (
           null
          ),
        }}
      />
  );
}
