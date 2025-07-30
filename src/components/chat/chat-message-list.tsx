import { useEffect } from "react";

import Stack from '@mui/material/Stack';
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from '@mui/material/LinearProgress';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { Iconify } from "../iconify";
import { ChatMessageItem } from './chat-message-item';
import LgAnimateLoading from "../loading-screen/animate";
import { useMessagesScroll } from './hooks/use-messages-scroll';
import ProPackagesComponent from "../Pro-Packages/pro-packages-component";

import type { IChat } from '../../types/chat';
import type { ITicketResponse } from '../../types/tickets';

// ------------------------------------------------------------------
type Props = {
  loading?: boolean;
  messages: ITicketResponse[] | IChat[];
  isTicket: boolean;
  isChatLoading: boolean;
  resendButtonStatus: boolean;
  handleSendChatResponse: (message?: string) => void;
  setIsChatLoading: (value: boolean) => void;
};

// Type Guard
function isChatMessage(message: IChat | ITicketResponse): message is IChat {
  return (message as IChat)?.role !== undefined;
}

// ------------------------------------------------------------------
export function ChatMessageList({
                                  isTicket,
                                  handleSendChatResponse,
                                  resendButtonStatus,
                                  isChatLoading,
                                  setIsChatLoading,
                                  messages = [],
                                  loading
                                }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);
  const theme = useTheme();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!isTicket && isChatMessage(lastMessage) && lastMessage?.role === "assistant") {
      setIsChatLoading(false);
    }
  }, [messages, setIsChatLoading, isTicket]);

  const slides = isTicket
    ? (messages as ITicketResponse[])
      .filter((message) => message.contentType === 'image')
      .map((message) => ({ src: message.text }))
    : [];

  const lightbox = useLightBox(slides);

  let lastChatMessage: IChat | null = null;

  if (!isTicket && isChatMessage(messages[messages.length - 1])) {
    lastChatMessage = messages[messages.length - 1] as IChat;
  }

  if (loading) {
    return (
      <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: 'absolute',
          }}
        />
      </Stack>
    );
  }
  return (
    <>
      {!messages?.length && (<Stack direction='row' justifyContent='center' alignItems="center" sx={{height:'100%',width:'100%'}}>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Iconify icon="CHATBOT" sx={{width:'120px',height:'120px',color:theme.palette.primary.main}} />
            <Typography
              color={theme.palette.grey[600]}
              sx={{ whiteSpace: 'pre-line',mt:4 }}
              variant="body2"
              textAlign="center"
              lineHeight={2.5}
            >
              سلام، من کوچی باتم!
              {'\n'}هر سوال مهاجرتی داری، با خیال راحت بپرس
              {'\n'}من از منابع معتبر و به‌روز برات پیدا میکنم.
            </Typography>
          </Stack>
      </Stack>)}
      <Scrollbar
        ref={messagesEndRef}
        sx={{
          px: 3,
          pt: 5,
          pb: 3,
          flex: '1 1 auto',
        }}
      >
        {messages.map((message: any) => (
          <ChatMessageItem
            handleSendChatResponse={handleSendChatResponse}
            key={message?.id || message?._id}
            message={message}
          />
        ))}

        {isChatLoading && (
          <Stack direction="row" justifyContent="right">
            <LgAnimateLoading isChatLoading />
          </Stack>
        )}
        {lastChatMessage?.showPlans && <ProPackagesComponent />}

        <Stack>
          {resendButtonStatus && (
            <LoadingButton
              startIcon={<Iconify icon="return" sx={{ width: 15 }} />}
              fullWidth={false}
              onClick={() => handleSendChatResponse()}
              color="secondary"
            >
              تلاش مجدد
            </LoadingButton>
          )}
        </Stack>
      </Scrollbar>

      {isTicket && slides.length > 0 && (
        <Lightbox
          slides={slides}
          open={lightbox.open}
          close={lightbox.onClose}
          index={lightbox.selected}
        />
      )}
    </>
  );
}
