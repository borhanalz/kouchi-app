import {ReactNode} from "react";
import remarkGfm from "remark-gfm";
import {format} from 'date-fns-jalali';
import {useSelector} from "react-redux";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {toPersianNumber} from "../../utils/persian-number";

import type {IChat} from '../../types/chat';
import type {RootState} from "../../lib/redux/store";
import type {ITicketResponse} from '../../types/tickets';

// ----------------------------------------------------------------------------
const markdownComponents = {
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <table
      {...props}
      style={{
        borderCollapse: 'collapse',
        width: '100%',
      }}
    />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      style={{
        border: '1px solid #ccc',
        padding: '8px',
        backgroundColor: '#757474',
        textAlign: 'center',
      }}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      {...props}
      style={{
        border: '1px solid #ccc',
        padding: '8px',
      }}
    />
  ),
  a: ({href, children}:{href:string, children:ReactNode|string}) => (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{color: 'secondary.main', textDecoration: 'underline'}}
    >
      {children}
    </Link>
  ),
};

//--------------------------------------------------------------------------------------------------
type Props = {
  message: ITicketResponse | IChat;
  handleSendChatResponse: (message?: string) => void;
};

function isTicketResponse(message: ITicketResponse | IChat): message is ITicketResponse {
  return 'responderType' in message;
}

export function ChatMessageItem({message, handleSendChatResponse}: Props) {
  const theme = useTheme();
  const userName = useSelector((state: RootState) => state?.userReducer?.info?.name);

  const isTicket = isTicketResponse(message);
  const isUser = isTicket ? message.responderType === 'user' : message.role === "user";
  console.log(message)
  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{mb: 1, color: 'text.disabled', ...(isUser && {mr: 'auto'})}}
    >
      {isUser ? userName : "کوچی"}
    </Typography>
  );

  const renderBody = () => (
    <Stack
      sx={{
        p: 2,
        minWidth: 300,
        maxWidth: 500,
        borderRadius: 1,
        bgcolor: theme.vars.palette.secondary.light,
        ...(!isUser && {color: 'grey.800', bgcolor: 'primary.lighter'}),
      }}
    >
      {isTicket && message.attachments?.length > 0 ? (
        <Stack spacing={2}>
          <Typography component="div" fontWeight="bold" lineHeight={1.8}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
              {message?.text}
            </ReactMarkdown>
          </Typography>
          <Box
            sx={{
              borderRadius: 1.5,
              cursor: 'pointer',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.vars.palette.primary.main
                  : theme.vars.palette.grey[300],
              p: 1,
              '&:hover': {opacity: 0.9},
            }}
          >
            <Typography variant="caption">
              {toPersianNumber(`${message.attachments?.length} فایل پیوست دارد.`)}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <span component="div" style={{fontSize:'15px',color:'#fff',fontFamily:'Vazir'}} color="#fff" lineHeight={1.8}>
           <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
                   {(message as IChat).content || ''}
           </ReactMarkdown>
        </span>
      )}
      <Typography variant="subtitle2" fontSize={12} mt={1.5} color={theme.palette.grey[200]}>
        {toPersianNumber(format(isTicket ? message?.createdAt : message?.timestamp, 'HH:mm'))} ,{' '}
        {toPersianNumber(format(isTicket ? message?.createdAt : message?.timestamp, 'yyyy-MM-dd'))}
      </Typography>
    </Stack>
  );

  if (isTicket ? !message.text : !message.content) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 5,
        display: 'flex',
        justifyContent: isUser ? 'unset' : 'flex-end',
      }}
    >
      <Stack alignItems={isUser ? 'flex-end' : 'flex-start'}>
        {renderInfo()}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': {
              '& .message-actions': {opacity: 1},
            },
          }}
        >
          {renderBody()}
        </Box>
        <Stack spacing={2} mt={1.5} sx={{width: '100%'}}>
          {!isTicket && message.options && message.options.map((option) => (
            <Button
              onClick={(e) => handleSendChatResponse(e?.currentTarget?.textContent as string)}
              fullWidth
              color="secondary"
              variant="outlined"
              key={option}
            >
              {toPersianNumber(option)}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
