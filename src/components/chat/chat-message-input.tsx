import {toast} from "sonner";
import {usePathname} from "next/navigation";
import {useRef, useState, useCallback} from 'react';
import {useMutation, useQueryClient} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import {Iconify} from 'src/components/iconify';
import {DeleteButton, SingleFilePreview} from 'src/components/upload/components/preview-single-file';

import {IChat} from "../../types/chat";
import {endpoints} from "../../hooks/endPoints";
import {CustomPopover} from '../custom-popover';
import {EditCreateRequest} from "../../lib/axios";

import type {IAddResponseFormData, IApiAddResponse, ITicketResponse} from "../../types/tickets";

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
  const [file, setFile] = useState<File | null>();
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const latestMessage:any = messages[messages?.length - 1];
  const disableInput = !isTicket && latestMessage?.options?.length > 0

  const {mutateAsync: AddResponse, isPending: addResponsePending} = useMutation({
    mutationKey: ['add-response-ticket'],
    mutationFn: (data: IAddResponseFormData) =>
      EditCreateRequest<IAddResponseFormData, IApiAddResponse>(
        endpoints.TICKETS.ADD_RESPONSE,
        data,
        {"Content-Type": "multipart/form-data"}
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

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isTicket) {
      setMessage(event.target.value);
    } else {
      setChatMessage(event.target.value)
    }
  }, []);

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
          queryClient.invalidateQueries({queryKey: ["get-ticket-by-id"]});
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
  }, [message, isTicket, ticketId, AddResponse, queryClient, HandleChatResponse, file]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
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
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={isTicket ? message : chatMessage}
        onChange={handleChangeMessage}
        disabled={isChatLoading || disableInput}
        onKeyDown={handleKeyDown}
        placeholder="پاسخ خود را بنویسید…"
        startAdornment={
          <IconButton
            onClick={handleSendResponse}
            disabled={isChatLoading || addResponsePending || addChatResponsePending}
          >
            {addResponsePending || addChatResponsePending ? (
              <Iconify icon="circularLoading"/>
            ) : (
              <Iconify icon="send"/>
            )}
          </IconButton>
        }
        endAdornment={
          <Box sx={{flexShrink: 0, display: 'flex'}}>
            {isTicket && (
              <Stack>
                <IconButton
                  ref={attachmentButtonRef}
                  onClick={handleAttach}
                  disabled={addResponsePending || addChatResponsePending || disableInput}
                >
                  <Iconify icon="attachment"/>
                </IconButton>
              </Stack>
            )}
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
        sx={{mt: -2}}
        slotProps={{arrow: {placement: 'bottom-center'}}}
      >
        {file ? (
          <Box sx={{position: 'relative', p: 1, width: 100, height: 100}}>
            <SingleFilePreview file={file}/>
            <DeleteButton onClick={handleRemoveFile}/>
          </Box>
        ) : (
          <Box sx={{p: 2, fontSize: '14px'}}>فایلی انتخاب نشده است !</Box>
        )}
      </CustomPopover>

      <input
        type="file"
        ref={fileRef}
        style={{display: 'none'}}
        onChange={handleFileChange}
        disabled={addResponsePending || addChatResponsePending}
      />
    </>
  );
}
