'use client';

import {toast} from "sonner";
import {z as zod} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import {ChatLayout} from './layout';
import {Field, Form} from "../hook-form";
import {paths} from "../../routes/paths";
import {useRouter} from "../../routes/hooks";
import {endpoints} from "../../hooks/endPoints";
import {EditCreateRequest} from "../../lib/axios";
import {ChatMessageList} from './chat-message-list';
import {ChatMessageInput} from './chat-message-input';

import type {IApiCreateTicket, ICreateTicketFormData, ITicketResponse} from "../../types/tickets";
import {useTheme} from "@mui/material/styles";

// ----------------------------------------------------------------------
type ChatType = {
  isTicket?: boolean,
  messages: ITicketResponse[]
}

export function Chat({isTicket = false, messages}: ChatType) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme()
  const createTicketSchema = zod.object({
    title: zod.string().min(2, {message: 'عنوان حداقل باید 2 کاراکتر باشد'}),
    priority: zod.string().min(2, {message: 'میزان اهمیت حداقل باید 3 کاراکتر باشد'}),
    description: zod.string().min(2, {message: 'پیغام حداقل باید 6 کاراکتر باشد'}),
    category: zod.string().min(2, {message: 'موضوع حداقل باید 3 کاراکتر باشد'}),
    attachments: zod.custom().transform((data, ctx) => {
      const hasFile = data instanceof File || (typeof data === 'string' && !!data.length);
      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'فایل را انتخاب کنید',
        });
        return null;
      }
      return data;
    }),
  });
  const methods = useForm<ICreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      priority: '',
      description: '',
      category: '',
      attachments:null
    }
  });
  const {handleSubmit,setValue} = methods;

  const {mutateAsync: CreateTicket, isPending: createTicketPending} = useMutation({
    mutationKey: ['create-ticket'],
    mutationFn: (data: ICreateTicketFormData) => EditCreateRequest<ICreateTicketFormData, IApiCreateTicket>(endpoints.TICKETS.CREATE, data,{"Content-Type":"multipart/form-data"})
  })
  const handleSendMessage = handleSubmit(async (payloads) => {
    try {
      const response = await CreateTicket({
        "title": payloads?.title,
        "description": payloads?.description,
        "category": payloads?.category,
        "priority": payloads?.priority,
        "requiresPayment": false,
        "price": 1000,
        attachments:payloads?.attachments
      });
      toast.success("تیکت با موفقیت ایجاد شد");
      router.push(paths.dashboard.tickets.details(String(response.ticketId)));
      queryClient.invalidateQueries({queryKey: ["get-ticket-by-id"]});
    } catch (e) {
      console.log(e)
    }
  });

  const hasConversation = messages?.length > 0;
  return (
    <>
    {messages?.length>0?<ChatLayout
      slots={{
        // header: hasConversation ? (
        //   <ChatHeaderDetail
        //     collapseNav={roomNav}
        //     participants={filteredParticipants}
        //     loading={conversationLoading}
        //   />
        // ) : (
        //   <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients}/>
        // ),
        header:null,
        nav: null,
        main: (
          <>
            {messages?.length > 0 && (
              <ChatMessageList
                messages={messages ?? []}
              />
            )}
            <ChatMessageInput
              isNewTicket={messages?.length<1}
            />
          </>
        ),
        details: hasConversation && null,
      }}
    />:<Stack>
      <Form methods={methods} onSubmit={handleSendMessage}>
        <Stack spacing={2} sx={{border:1,boxShadow:0.5,borderRadius:2,p:2,borderColor:theme?.vars?.palette?.grey[300]}}>
          <Field.Text name='title' label='عنوان'/>
          <Field.Text name='category' label='موضوع'/>
          <Field.Text name='priority' label='میزان اهمیت'/>
          <Field.Text type='text' name='description' label='پیغام ...'/>
          <Field.Upload name='attachments' onDelete={()=>setValue("attachments",null)}/>
          <Button type='submit' variant='contained' loading={createTicketPending}>ایجاد تیکت</Button>
        </Stack>
      </Form>
  </Stack>}
      </>
  );
}
