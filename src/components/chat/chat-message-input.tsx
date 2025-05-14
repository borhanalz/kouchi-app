import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useRef, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { Iconify } from 'src/components/iconify';
import { DeleteButton, SingleFilePreview } from 'src/components/upload/components/preview-single-file';

import { IChat } from "../../types/chat";
import { endpoints } from "../../hooks/endPoints";
import { CustomPopover } from '../custom-popover';
import { EditCreateRequest } from "../../lib/axios";

import type { IAddResponseFormData, IApiAddResponse, ITicketResponse } from "../../types/tickets";

//----------------------------------------------------------------------------------
type Props = {
  isNewTicket?: boolean;
  isTicket: boolean;
  HandleChatResponse: () => void;
  addChatResponsePending: boolean;
  isChatLoading: boolean;
  setChatMessage?: any;
  chatMessage?: string;
  messages: ITicketResponse[] | IChat[];
};

// --------------------------------------------------------------------------------
export function ChatMessageInput({
                                   isNewTicket = true,
                                   isChatLoading,
                                   addChatResponsePending,
                                   isTicket,
                                   HandleChatResponse,
                                   setChatMessage,
                                   chatMessage,
                                   messages
                                 }: Props) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const fileRef = useRef<HTMLInputElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement | null>(null);
  const ticketId = pathname?.split("/")[3];
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const latestMessage: any = messages[messages?.length - 1];
  const disableInput = !isTicket && latestMessage?.options?.length > 0;

  const { mutateAsync: AddResponse, isPending: addResponsePending } = useMutation({
    mutationKey: ['add-response-ticket'],
    mutationFn: (data: IAddResponseFormData) =>
      EditCreateRequest<IAddResponseFormData, IApiAddResponse>(
        endpoints.TICKETS.ADD_RESPONSE,
        data,
        { "Content-Type": "multipart/form-data" }
      )
  });

  const handleAttach = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleClosePopover = useCallback(() => {
    setPopoverAnchor(null);
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isTicket) {
      setMessage(event.target.value);
    } else {
      setChatMessage(event.target.value);
    }
  }, [isTicket, setChatMessage]);

  const handleSendResponse = useCallback(async () => {
    if (message.trim() || chatMessage?.trim() !== '') {
      try {
        if (isTicket) {
          await AddResponse({
            ticketId: Number(ticketId),
            "responderType": "user",
            "responderName": "test",
            "text": message,
            "attachments": file ?? null
          });
          queryClient.invalidateQueries({ queryKey: ["get-ticket-by-id"] });
        } else {
          await HandleChatResponse();
        }
        setMessage('');
        setFile(null);
      } catch (e) {
        console.error(e);
        toast.error("ارسال پیام با خطا مواجه شد");
      }
    } else {
      toast.error("لطفا پیغام خود را وارد کنید");
    }
  }, [message, isTicket, ticketId, AddResponse, queryClient, HandleChatResponse, file, chatMessage]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendResponse();
    }
  }, [handleSendResponse]);


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    handleClosePopover();
  }, [handleClosePopover]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          px: 1,
          py: 0.5,
        }}
      >
        <IconButton
          onClick={handleSendResponse}
          disabled={isChatLoading || addResponsePending || addChatResponsePending}
        >
          {addResponsePending || addChatResponsePending ? (
            <Iconify icon="circularLoading" />
          ) : (
            <Iconify icon="send" />
          )}
        </IconButton>

        <TextField
          multiline
          maxRows={4}
          fullWidth
          variant="standard"
          value={isTicket ? message : chatMessage}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
          disabled={isChatLoading || disableInput}
          placeholder="سوالت رو اینجا بنویس..."
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              '& textarea': {
                resize: 'none',
                minHeight: '40px',
                maxHeight: '120px',
                overflowY: 'auto !important',
                paddingTop: '10px', // this helps center it vertically
              },
            },
          }}
        />


        {isTicket && (
          <IconButton
            ref={attachmentButtonRef}
            onClick={handleAttach}
            disabled={addResponsePending || addChatResponsePending || disableInput}
          >
            <Iconify icon="attachment" />
          </IconButton>
        )}
      </Box>

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
          <Box sx={{ p: 2, fontSize: '14px' }}>فایلی انتخاب نشده است !</Box>
        )}
      </CustomPopover>

      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={addResponsePending || addChatResponsePending}
      />
    </>
  );
}
