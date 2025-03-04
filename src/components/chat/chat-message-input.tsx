import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { today } from 'src/utils/format-time';

import { sendMessage, createConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { DeleteButton, SingleFilePreview } from 'src/components/upload/components/preview-single-file';

import { useMockedUser } from 'src/auth/hooks';

import { CustomPopover } from '../custom-popover';
import { initialConversation } from './utils/initial-conversation';

import type { IChatParticipant } from '../../types/chat-component';

type Props = {
  disabled: boolean;
  recipients: IChatParticipant[];
  selectedConversationId: string;
  onAddRecipients: (recipients: IChatParticipant[]) => void;
};

export function ChatMessageInput({
                                   disabled,
                                   recipients,
                                   onAddRecipients,
                                   selectedConversationId,
                                 }: Props) {
  const router = useRouter();
  const { user } = useMockedUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement | null>(null);

  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);

  const myContact: IChatParticipant = useMemo(
    () => ({
      id: `${user?.id}`,
      role: `${user?.role}`,
      email: `${user?.email}`,
      address: `${user?.address}`,
      name: `${user?.displayName}`,
      lastActivity: today(),
      avatarUrl: `${user?.photoURL}`,
      phoneNumber: `${user?.phoneNumber}`,
      status: 'online',
    }),
    [user]
  );

  const { messageData, conversationData } = initialConversation({
    message,
    recipients,
    me: myContact,
  });

  const handleAttach = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleClosePopover = () => {
    setPopoverAnchor(null);
  };

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' || !message) return;

      try {
        if (selectedConversationId) {
          await sendMessage(selectedConversationId, messageData);
        } else {
          const res = await createConversation(conversationData);
          router.push(`${paths.dashboard.root}?id=${res.conversation.id}`);
          onAddRecipients([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
        setFile(null);
      }
    },
    [conversationData, message, messageData, onAddRecipients, router, selectedConversationId]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    handleClosePopover();
  };

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="گفت و گو کنید ..."
        startAdornment={
          <IconButton>
            <Iconify icon="send" />
          </IconButton>
        }
        endAdornment={
          <Box sx={{ flexShrink: 0, display: 'flex' }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="galleryUpload" />
            </IconButton>
            <Stack>
              <IconButton
                ref={attachmentButtonRef}
                onClick={handleAttach}
              >
                <Iconify icon="attachment" />
              </IconButton>
            </Stack>
            <IconButton>
              <Iconify icon="microphone" />
            </IconButton>
          </Box>
        }
        sx={[
          (theme) => ({
            px: 1,
            height: 56,
            flexShrink: 0,
            borderTop: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      />

      {/* Custom Popover Above the Attachment Button */}
      <CustomPopover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{ mt: -2 }}
        slotProps={{ arrow: { placement: 'bottom-center' } }}

      >
        {file ? (
          <Box sx={{ position: 'relative', p: 1, width: 100, height: 100 }}>
            <SingleFilePreview file={file} />
            <DeleteButton onClick={handleRemoveFile} />
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>No file selected</Box>
        )}
      </CustomPopover>

      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}
