import Image from "next/image";
import illustration from 'public/assets/images/ilustration-map.png'

import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from '@mui/material/LinearProgress';

import {Scrollbar} from 'src/components/scrollbar';
import {Lightbox, useLightBox} from 'src/components/lightbox';

import {Iconify} from "../iconify";
import {ChatMessageItem} from './chat-message-item';
import LgAnimateLoading from "../loading-screen/animate";
import {useMessagesScroll} from './hooks/use-messages-scroll';

import type {IChat} from '../../types/chat';
import type {ITicketResponse} from '../../types/tickets';
// -----------------------------------------------------------------
type Props = {
  loading?: boolean;
  messages: ITicketResponse[] | IChat[];
  isTicket: boolean;
  isChatLoading: boolean;
  resendButtonStatus: boolean;
  handleSendChatResponse: (message?:string) => void;
  handleAddMoreMessages?:()=>void;
  deactiveMoreMessageButton?:boolean
};

// ------------------------------------------------------------------
export function ChatMessageList({
                                  isTicket,
                                  handleSendChatResponse,
                                  resendButtonStatus,
                                  isChatLoading,
                                  deactiveMoreMessageButton,
                                  handleAddMoreMessages,
                                  messages = [],
                                  loading
                                }: Props) {
  const {messagesEndRef} = useMessagesScroll(messages);
  const theme = useTheme();

  const slides = isTicket
    ? (messages as ITicketResponse[]).filter((message) => message.contentType === 'image')
      .map((message) => ({src: message.text}))
    : [];

  const lightbox = useLightBox(slides);

  if (loading) {
    return (
      <Stack sx={{flex: '1 1 auto', position: 'relative'}}>
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
      <Scrollbar
        ref={messagesEndRef}
        sx={{
          px: 3,
          pt: 5,
          pb: 3,
          flex: '1 1 auto',
        }}
      >
        {!deactiveMoreMessageButton&&<Button onClick={handleAddMoreMessages}>پیام های قبلی..</Button>}
        {!messages?.length && <Stack direction='column' justifyContent='center' alignItems='center'>
          <Image src={illustration} alt='illustration' style={{width: '200px', height: 'auto'}}/>
          <Typography
            color={theme.palette.grey[600]}
            sx={{whiteSpace: 'pre-line'}}
            variant='body2'
            textAlign='center'
            lineHeight={2.5}
          >
            🤖 به دستیار هوشمندِ کوچی خوش اومدی!
            {'\n'}💬 یه گپ کوتاه می‌تونه همه چیز رو روشن کنه، پس هر سوالی داری راحت بپرس.
            {'\n'}📚 من به اطلاعات به‌روز و دقیقی که کارشناسان با‌تجربه جمع‌آوری کردن دسترسی دارم و می‌تونیم یک جلسه‌‌ی مشاوره‌ی بی‌پایان داشته‌باشیم.
          </Typography>
        </Stack>}
        {messages.map((message: any) => (
          <ChatMessageItem handleSendChatResponse={handleSendChatResponse} key={message?.id} message={message}/>
        ))}
        {isChatLoading && <Stack direction='row' justifyContent='right'>
          <LgAnimateLoading/>
        </Stack>}
        <Stack>
          {resendButtonStatus && <LoadingButton startIcon={<Iconify icon='return' sx={{width: 15}}/>} fullWidth={false}
                                                onClick={()=>handleSendChatResponse()} color='secondary'>تلاش
            مجدد</LoadingButton>}
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
