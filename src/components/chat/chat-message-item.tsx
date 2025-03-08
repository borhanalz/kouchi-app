import type { IChatParticipant } from 'src/types/chat-component';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {useTheme} from "@mui/material/styles";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import type {ITicketResponse} from "../../types/tickets";

// ----------------------------------------------------------------------

type Props = {
  message: ITicketResponse;
};

export function ChatMessageItem({ message }: Props) {
  const theme = useTheme();
  const isUser = message?.responderType==="user";

  const { responderName } = message;

  const { text, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(isUser && { mr: 'auto' }) }}
    >
      {isUser && `${responderName}, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = () => (
    <Stack
      sx={{
        p: 2,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        bgcolor: theme.vars.palette.primary.light,
        ...(!isUser && { color: 'grey.800', bgcolor: 'primary.light' }),
        // ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {/*{hasImage ? (*/}
      {/*  <Box*/}
      {/*    component="img"*/}
      {/*    alt="Attachment"*/}
      {/*    src={text}*/}
      {/*    onClick={() => onOpenLightbox(text)}*/}
      {/*    sx={{*/}
      {/*      width: 400,*/}
      {/*      height: 'auto',*/}
      {/*      borderRadius: 1.5,*/}
      {/*      cursor: 'pointer',*/}
      {/*      objectFit: 'cover',*/}
      {/*      aspectRatio: '16/11',*/}
      {/*      '&:hover': { opacity: 0.9 },*/}
      {/*    }}*/}
      {/*  />*/}
      {/*) : (*/}
        <Typography lineHeight={1.8} variant='body1'>{text}</Typography>
      {/*)}*/}
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
        ...(!isUser && { right: 0, left: 'unset' }),
      })}
    >
      <IconButton size="small">
        <Iconify icon="arrowBack" sx={{width:15,height:15}} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="smile" sx={{width:15,height:15}} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="trash" sx={{width:15,height:15}} />
      </IconButton>
    </Box>
  );

  if (!message.text) {
    return null;
  }

  return (
    <Box sx={{ mb: 5, display: 'flex', justifyContent: message?.responderType!=="user" ? 'flex-end' : 'unset' }}>
      {/*{!me && <Avatar alt={firstName} src={img.src} sx={{ width: 32, height: 32, mr: 2 }} />}*/}
      {/*<Image src={img} alt='img' style={{ width: 40,height:40,borderRadius:50 }} />*/}
      <Stack alignItems={message?.responderType==="user" ? 'flex-end' : 'flex-start'}>
        {renderInfo()}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody()}
          {renderActions()}
        </Box>
      </Stack>
    </Box>
  );
}
