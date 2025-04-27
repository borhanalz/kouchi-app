import {faIR} from 'date-fns-jalali/locale';
import {format, formatDistance} from 'date-fns-jalali';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {Iconify} from 'src/components/iconify';

import type {IChat} from '../../types/chat';
import type {ITicketResponse} from '../../types/tickets';
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {RootState} from "../../lib/redux/store";

// ----------------------------------------------------------------------

type Props = {
  message: ITicketResponse | IChat;
  handleSendChatResponse: (message?: string) => void;
};

// Type guard to identify ITicketResponse
function isTicketResponse(message: ITicketResponse | IChat): message is ITicketResponse {
  return 'responderType' in message;
}

export function ChatMessageItem({message, handleSendChatResponse}: Props) {
  const theme = useTheme();
  const userName = useSelector((state:RootState)=>state?.userReducer?.info?.name);

  const isTicket = isTicketResponse(message);
  const isUser = isTicket ? message.responderType === 'user' : message.role === "user";

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{mb: 1, color: 'text.disabled', ...(isUser && {mr: 'auto'})}}
    >
      {isUser?userName:"کوچی"}
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
          <Typography>{message?.text}</Typography>
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
              {`${message.attachments?.length} فایل پیوست دارد.`}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Typography component="div" color='#fff' fontWeight='bold' lineHeight={1.8}>
          {isTicket ? message?.text : message?.content.split('\n').map((line, index) => (
            <span key={index} style={{fontSize:'15px'}}>
      {line}
              <br/>
    </span>
          ))}
        </Typography>
      )}
      <Typography variant='subtitle2' fontSize={12} mt={1.5} color={theme.palette.grey[200]}>{format(isTicket ? message?.createdAt : message?.timestamp, 'HH:mm')} , {format(isTicket ? message?.createdAt : message?.timestamp, 'yyyy-MM-dd')}</Typography>
    </Stack>
  );

  const renderActions = () => (
    <Box
      className="message-actions"
      sx={() => ({
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        display: 'flex',
        position: 'absolute',
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(!isUser && {right: 0, left: 'unset'}),
      })}
    >
      <IconButton size="small">
        <Iconify icon="arrowBack" sx={{width: 15, height: 15}}/>
      </IconButton>

      <IconButton size="small">
        <Iconify icon="smile" sx={{width: 15, height: 15}}/>
      </IconButton>

      <IconButton size="small">
        <Iconify icon="trash" sx={{width: 15, height: 15}}/>
      </IconButton>
    </Box>
  );

  if (isTicket ? !message.text : !message.content) {
    return null;
  }

  const distance = formatDistance(new Date(isTicket ? message?.createdAt : message?.timestamp), new Date(),
    {
      addSuffix: true,
      locale:
      faIR,
    }
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
              '& .message-actions': {opacity: 1},
            },
          }}
        >
          {renderBody()}
          {/*{renderActions()}*/}
        </Box>
        <Stack spacing={2} mt={1.5} sx={{width: '100%'}}>
          {!isTicket && message.options && message?.options?.map((option) => {
            return <Button onClick={(e) => handleSendChatResponse(e?.currentTarget?.textContent as string)} fullWidth
                           color='secondary' variant='outlined'>{option}</Button>
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
