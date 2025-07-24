'use client';

import {toast} from "sonner";
import {z as zod} from "zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import {Iconify} from "../iconify";
import {ChatLayout} from './layout';
import {Field, Form} from "../hook-form";
import {paths} from "../../routes/paths";
import {useRouter} from "../../routes/hooks";
import {endpoints} from "../../hooks/endPoints";
import {EditCreateRequest} from "../../lib/axios";
import {ChatMessageList} from './chat-message-list';
import {ChatMessageInput} from './chat-message-input';
import {IApiChat, IChat, IChatFormData} from "../../types/chat";

import type {
  AgentType,
  IApiCreateTicket,
  ICreateTicketFormData,
  ITicketFormData,
  ITicketResponse
} from "../../types/tickets";

// ----------------------------------------------------------------------
type ChatType = {
  messages: ITicketResponse[] | IChat[],
  title?: string,
  IsTicket?: boolean,
  assignmentInfo?: AgentType,
  refetch?:any,
  isProService?:boolean
}

// -------------------------------------------------------------------------------
export function Chat({title,isProService, assignmentInfo, messages, IsTicket = false}: ChatType) {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [resendButtonStatus, setResendButtonStatus] = useState(false);
  const [chatMessage, setChatMessage] = useState<string>('');

  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();

  const createTicketSchema = zod.object({
    title: zod.string().min(2, {message: 'عنوان حداقل باید 2 کاراکتر باشد'}),
    description: zod.string().min(2, {message: 'پیغام حداقل باید 6 کاراکتر باشد'}),
    attachments: zod
      .custom<File | string | undefined>()
      .optional()
      .transform((data, ctx) => {
        if (!data) return undefined;

        const hasFile =
          data instanceof File || (typeof data === 'string' && data.length > 0);

        if (!hasFile) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: 'فایل معتبر نیست',
          });
          return undefined;
        }

        return data;
      }),
  });
  const methods = useForm<ICreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      attachments: null
    }
  });
  const {handleSubmit, setValue} = methods;

  const {mutateAsync: CreateTicket, isPending: createTicketPending} = useMutation({
    mutationKey: ['create-ticket'],
    mutationFn: (data: ICreateTicketFormData) => EditCreateRequest<ICreateTicketFormData, IApiCreateTicket>(endpoints.TICKETS.CREATE, data, {"Content-Type": "multipart/form-data"})
  })
  const handleSendMessage = handleSubmit(async (payloads) => {
    try {
      const response = await CreateTicket({
        "title": payloads?.title,
        "description": payloads?.description,
        "requiresPayment": false,
        "price": 1000,
        attachments: payloads?.attachments
      });
      toast.success("تیکت با موفقیت ایجاد شد");
      await queryClient.invalidateQueries({queryKey: ["get-ticket-by-id"]});
      await queryClient.invalidateQueries({queryKey: ["tickets-list"]});
      router.push(paths.dashboard.tickets.details(String(response.ticketId)));
    } catch (e) {
      console.log(e)
    }
  });

  // chat send response request
  const {mutateAsync: AddChatResponse, isPending: addChatResponsePending} = useMutation({
    mutationKey: ['add-chat-response'],
    mutationFn: (data: IChatFormData) => EditCreateRequest<IChatFormData, IApiChat>(endpoints.CHAT.CHAT, data, {}, 'post', {baseURL: 'https://chat.koochi.app'})
  });
  const HandleChatResponse = async (message = "") => {
    try {
      const response = await AddChatResponse({ message: message || chatMessage });

      if (response?.status === "upgrade_required") {
        await queryClient.invalidateQueries({ queryKey: ["get-chat-history"] });
      }

      if (response.status === "ok") {
        // invalidate to show user message immediately
        await queryClient.invalidateQueries({ queryKey: ["get-chat-history"] });
        setIsChatLoading(true);
        setChatMessage("");
        setResendButtonStatus(false);

        const maxTime = 5 * 60 * 1000;
        const startTime = Date.now();

        const pollAssistantReply = async () => {
          const elapsed = Date.now() - startTime;

          const updatedMessages: any = queryClient.getQueryData(["get-chat-history"]);
          const chats = updatedMessages?.chats ?? updatedMessages;
          const lastMessage = chats?.[chats.length - 1];

          if (lastMessage?.role === "assistant") {
            setIsChatLoading(false);
            return;
          }

          if (elapsed >= maxTime) {
            setIsChatLoading(false);
            setResendButtonStatus(true);
            return;
          }

          await queryClient.invalidateQueries({ queryKey: ["get-chat-history"] });

          const nextDelay = elapsed < 2 * 60 * 1000 ? 30 * 1000 : 15 * 1000;
          setTimeout(pollAssistantReply, nextDelay);
        };

        setTimeout(pollAssistantReply, 0);
      }
    } catch (error) {
      console.error("خطا در ارسال پیام:", error);
      setIsChatLoading(false);
      setResendButtonStatus(true);
    }
  };

  const hasConversation = messages?.length > 0;
  return (
    <>
      {!IsTicket ? <ChatLayout sx={{mb: 2}}
                               slots={{
                                 header:null,
                                 nav: null,
                                 main: (
                                   <>
                                     <ChatMessageList
                                       handleSendChatResponse={HandleChatResponse}
                                       resendButtonStatus={resendButtonStatus}
                                       isChatLoading={isChatLoading}
                                       isTicket={IsTicket}
                                       setIsChatLoading={setIsChatLoading}
                                       messages={messages ?? []}
                                     />
                                     <ChatMessageInput
                                       chatMessage={chatMessage}
                                       setChatMessage={setChatMessage}
                                       isChatLoading={isChatLoading}
                                       addChatResponsePending={addChatResponsePending}
                                       HandleChatResponse={HandleChatResponse}
                                       isTicket={IsTicket}
                                       isNewTicket={messages?.length < 1}
                                       messages={messages}
                                     />
                                   </>
                                 ),
                                 details: hasConversation && null,
                               }}
      /> : messages?.length > 0 ? <ChatLayout IsTicket={IsTicket}
        slots={{
          header: <Stack mx={2} my={2} mt={3} spacing={0.5} alignItems='center' sx={{width:'100%'}}>
            <Stack justifyContent='space-between' direction='row' sx={{width:'100%'}}>
              <Stack spacing={1} textAlign='center'>
                <Stack spacing={1} direction='row'>
                  <Avatar color='primary' sx={{width: 30, height: 30}}/>
                  <Typography fontWeight='bold' variant='body1'>{assignmentInfo?.name || 'در حال بررسی برای ارسال به کوچ‌یار مناسب'} {assignmentInfo?.country &&`( ${assignmentInfo?.country} )`} </Typography>
                </Stack>
                {assignmentInfo?.name&&<Typography variant='subtitle2'
                                                   color={theme?.palette?.grey[400]}>{assignmentInfo?.successfulClientsCount} پرونده
                  موفق </Typography>}
              </Stack>
              <IconButton onClick={()=>router.push(isProService?paths.dashboard.services.userServices:paths.dashboard.tickets.root)}>
                <Iconify icon='arrowHeadLeft' sx={{width:16}}/>
              </IconButton>
            </Stack>
          </Stack>,
          nav: null,
          main: (
            <>
              {messages?.length > 0 && (
                <ChatMessageList
                  setIsChatLoading={setIsChatLoading}
                  handleSendChatResponse={HandleChatResponse}
                  resendButtonStatus={resendButtonStatus}
                  isChatLoading={isChatLoading}
                  isTicket={IsTicket}
                  messages={messages ?? []}
                />
              )}
              <ChatMessageInput
                messages={messages}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                isChatLoading={isChatLoading}
                addChatResponsePending={addChatResponsePending}
                HandleChatResponse={HandleChatResponse}
                isTicket={IsTicket}
                isNewTicket={messages?.length < 1}
              />
            </>
          ),
          details: hasConversation && null,
        }}
      /> : <Stack>
        <Form methods={methods} onSubmit={handleSendMessage}>
          <Stack spacing={2} sx={{
            border: 1,
            boxShadow: 0.5,
            borderRadius: 2,
            p: 2,
            borderColor: theme?.palette?.mode === "dark" ? theme?.vars?.palette?.grey[800] : theme?.vars?.palette?.grey[300]
          }}>
            <Field.Text name='title' label='عنوان'/>
            <Field.Text multiline rows={4} type='text' name='description' label='پیغام ...'/>
            <Field.Upload name='attachments' onDelete={() => setValue("attachments", null)}/>
            <Stack direction='row' justifyContent='right'>
              <Button type='submit' color='primary' variant='contained' loading={createTicketPending}>ایجاد
                تیکت</Button>
            </Stack>
          </Stack>
        </Form>
      </Stack>}

    </>
  );
}
