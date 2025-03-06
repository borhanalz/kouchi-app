import type { IChatMessage, IChatParticipant } from 'src/types/chat-component';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { getMessage } from './utils/get-message';

// ----------------------------------------------------------------------

type Props = {
  message: any;
  participants: IChatParticipant[];
  onOpenLightbox: (value: string) => void;
};

export function ChatMessageItem({ message, participants, onOpenLightbox }: Props) {
  const { user } = useMockedUser();

  const tt:any = { me:'f', senderDetails:{firstName:'ddd', avatarUrl:'dfdf'}, hasImage:false }
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { firstName, avatarUrl } = tt?.senderDetails;

  const { text:body, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!tt?.me && { mr: 'auto' }) }}
    >
      {!tt?.me && `${firstName}, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = () => (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(tt?.me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        ...(tt?.hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {tt?.hasImage ? (
        <Box
          component="img"
          alt="Attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : (
        body
      )}
    </Stack>
  );

  const renderActions = () => (
    <Box
      className="message-actions"
      sx={(theme) => ({
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        display: 'flex',
        position: 'absolute',
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(tt?.me && { right: 0, left: 'unset' }),
      })}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Box>
  );

  if (!message.body) {
    return null;
  }

  return (
    <Box sx={{ mb: 5, display: 'flex', justifyContent: tt?.me ? 'flex-end' : 'unset' }}>
      {!tt?.me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={tt?.me ? 'flex-end' : 'flex-start'}>
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
