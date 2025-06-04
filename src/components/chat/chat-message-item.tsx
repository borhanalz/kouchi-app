import { useSelector } from "react-redux";
import { faIR } from 'date-fns-jalali/locale';
import { format, formatDistance } from 'date-fns-jalali';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RootState } from "../../lib/redux/store";
import { toPersianNumber } from "../../utils/persian-number";

import type { IChat } from '../../types/chat';
import type { ITicketResponse } from '../../types/tickets';

// ----------------------------------------------------------------------

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <Link
          key={i}
          href={part}
          target="_parent"
          rel="noopener noreferrer"
          sx={{ color: 'secondary.main', textDecoration: 'underline' }}
        >
          {toPersianNumber(part)}
        </Link>
      );
    }
    return toPersianNumber(part);
  });
};

type Props = {
  message: ITicketResponse | IChat;
  handleSendChatResponse: (message?: string) => void;
};

function isTicketResponse(message: ITicketResponse | IChat): message is ITicketResponse {
  return 'responderType' in message;
}

export function ChatMessageItem({ message, handleSendChatResponse }: Props) {
  const theme = useTheme();
  const userName = useSelector((state: RootState) => state?.userReducer?.info?.name);

  const isTicket = isTicketResponse(message);
  const isUser = isTicket ? message.responderType === 'user' : message.role === "user";

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(isUser && { mr: 'auto' }) }}
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
        ...(!isUser && { color: 'grey.800', bgcolor: 'primary.lighter' }),
      }}
    >
      {isTicket && message.attachments?.length > 0 ? (
        <Stack spacing={2}>
          <Typography component="div" fontWeight="bold" lineHeight={1.8}>
            {message?.text.split('\n').map((line, index) => (
              <span key={index} style={{ fontSize: '15px' }}>
                {renderTextWithLinks(line)}
                <br />
              </span>
            ))}
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
              '&:hover': { opacity: 0.9 },
            }}
          >
            <Typography variant="caption">
              {toPersianNumber(`${message.attachments?.length} فایل پیوست دارد.`)}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Typography component="div" color="#fff" fontWeight="bold" lineHeight={1.8}>
          {(isTicket ? message?.text : message?.content).split('\n').map((line, index) => (
            <span key={index} style={{ fontSize: '15px' }}>
              {renderTextWithLinks(line)}
              <br />
            </span>
          ))}
        </Typography>
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

  const distance = formatDistance(
    new Date(isTicket ? message?.createdAt : message?.timestamp),
    new Date(),
    { addSuffix: true, locale: faIR }
  );

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
              '& .message-actions': { opacity: 1 },
            },
          }}
        >
          {renderBody()}
        </Box>
        <Stack spacing={2} mt={1.5} sx={{ width: '100%' }}>
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
