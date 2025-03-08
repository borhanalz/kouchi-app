import {z as zod} from "zod";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {usePathname} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import { useRef, useState, useCallback } from 'react';
import {useMutation, useQueryClient} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { DeleteButton, SingleFilePreview } from 'src/components/upload/components/preview-single-file';

import {Field, Form} from "../hook-form";
import {endpoints} from "../../hooks/endPoints";
import { CustomPopover } from '../custom-popover';
import {EditCreateRequest} from "../../lib/axios";
import {IAddResponseFormData, IApiAddResponse, IApiCreateTicket, ICreateTicketFormData} from "../../types/tickets";
//----------------------------------------------------------------------------------
type Props = {
  isNewTicket?: boolean;
};
// --------------------------------------------------------------------------------
export function ChatMessageInput({isNewTicket=true}:Props) {
  const router =useRouter();
  const pathname=usePathname();
  const queryClient = useQueryClient();
  const createTicketSchema = zod.object({
    title: zod.string().min(2, { message: 'عنوان حداقل باید 2 کاراکتر باشد' }),
    priority: zod.string().min(2, { message: 'میزان اهمیت حداقل باید 3 کاراکتر باشد' }),
    description: zod.string().min(2, { message: 'پیغام حداقل باید 6 کاراکتر باشد' }),
    category: zod.string().min(2, { message: 'موضوع حداقل باید 3 کاراکتر باشد' }),
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement | null>(null);
  const ticketId =pathname?.split("/")[3];
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>();
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);

  const methods = useForm<ICreateTicketFormData>({
    resolver:zodResolver(createTicketSchema),
    defaultValues:{
      title: '',
      priority: '',
      description:'',
      category:'',
    }
  });
  const {handleSubmit}=methods;

  const {mutateAsync:CreateTicket,isPending:createTicketPending}=useMutation({mutationKey:['create-ticket'],mutationFn:(data:ICreateTicketFormData)=>EditCreateRequest<ICreateTicketFormData,IApiCreateTicket>(endpoints.TICKETS.CREATE,data)})
  const {mutateAsync:AddResponse,isPending:addResponsePending}=useMutation({mutationKey:['add-response-ticket'],mutationFn:(data:IAddResponseFormData)=>EditCreateRequest<IAddResponseFormData,IApiAddResponse>(endpoints.TICKETS.ADD_RESPONSE,data)})

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

  const handleSendMessage = handleSubmit(async (payloads) => {
      try {
        const response = await CreateTicket({
          "title": payloads?.title,
          "description": payloads?.description,
          "category": payloads?.category,
          "priority": payloads?.priority,
          "requiresPayment":false,
          "price": 1000
        });
        toast.success("تیکت با موفقیت ایجاد");
        router.push(paths.dashboard.tickets.details(String(response.ticketId)));
        queryClient.invalidateQueries({queryKey: ["get-ticket-by-id"]});
      } catch (e) {
        console.log(e)
      }
    });

  const handleSendResponse = async()=>{
    console.log(message)
    if(message!=='') {
      try {
        const response = await AddResponse({
          ticketId: Number(ticketId),
          "responderType": "user",
          "responderName": "test",
          "text": message,
          "attachments": []
        });
        console.log(response);
        queryClient.invalidateQueries({queryKey: ["get-ticket-by-id"]});
        setMessage('')
        // router.push(paths.dashboard.tickets.details(String(response.ticketId)));
      } catch (e) {
        console.log(e)
      }
    }else {
      toast.error("لطفا پیغام خود را وارد کنید")
    }
  }

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
      {isNewTicket?<Form methods={methods} onSubmit={handleSendMessage}>
        <Stack spacing={2} p={2}>
          <Field.Text name='title' label='عنوان'/>
          <Field.Text name='category' label='موضوع'/>
          <Field.Text name='priority' label='میزان اهمیت'/>
          <Field.Text name='description' label='پیغام ...'/>
          <Button type='submit' variant='contained' loading={createTicketPending}>ایجاد تیکت</Button>
        </Stack>
      </Form>:<InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onChange={handleChangeMessage}
        placeholder="گفت و گو کنید ..."
        startAdornment={
          <IconButton onClick={handleSendResponse}>
            {addResponsePending?<Iconify icon="circularLoading"/>:<Iconify icon="send"/>}
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
      />}

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
