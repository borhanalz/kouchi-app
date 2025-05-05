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
  assignmentInfo?: AgentType
}

// -------------------------------------------------------------------------------
export function Chat({title, assignmentInfo, messages, IsTicket = false}: ChatType) {
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

  // ticket request
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
      router.push(paths.dashboard.tickets.details(String(response.ticketId)));
      await queryClient.invalidateQueries({queryKey: ["get-ticket-by-id"]});
      await queryClient.invalidateQueries({queryKey: ["tickets-list"]});
    } catch (e) {
      console.log(e)
    }
  });

  // chat send response request
  const {mutateAsync: AddChatResponse, isPending: addChatResponsePending} = useMutation({
    mutationKey: ['add-chat-response'],
    mutationFn: (data: IChatFormData) => EditCreateRequest<IChatFormData, IApiChat>(endpoints.CHAT.CHAT, data, {}, 'post', {baseURL: 'https://koochichat.liara.run'})
  });
  const HandleChatResponse = async (message = "") => {
    let retryCount = 0;
    const maxRetries = 5;
    const waitTime = 10000; // 10 seconds

    const sendMessage = async () => {
      const response = await AddChatResponse({message: message || chatMessage});
      if (response.status === "ok") {
        await queryClient.invalidateQueries({queryKey: ["get-chat-history"]});
        setIsChatLoading(true);
        setChatMessage("");
        setResendButtonStatus(false);
        const checkResponse = async () => {
          await queryClient.invalidateQueries({queryKey: ["get-chat-history"]});
          await new Promise((resolve) => setTimeout(resolve, 500));

          const updatedMessages = queryClient.getQueryData<IChat[]>(["get-chat-history"]) || [];
          const lastMessage = updatedMessages[updatedMessages.length - 1];

          if (lastMessage?.role !== "user") {
            setIsChatLoading(false)
          }

          if (!IsTicket) {
            const isUserMsg = lastMessage?.role === "user";
            const isUnprocessed = lastMessage?.status !== "processed";
            const isAssistant = lastMessage?.role === "assistant";

            if (isUserMsg && isUnprocessed) {
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(checkResponse, waitTime);
              } else {
                setResendButtonStatus(true);
                setIsChatLoading(false);
              }
            } else if (isAssistant || (isUserMsg && !isUnprocessed)) {
              setChatMessage("");
              setIsChatLoading(false);
            } else {
              setIsChatLoading(false);
            }
          } else {
            setIsChatLoading(false);
          }
        };

        setTimeout(checkResponse, waitTime);
      }
    };

    await sendMessage();
  };
  const hasConversation = messages?.length > 0;
  return (
    <>
      {!IsTicket ? <ChatLayout sx={{mb: 2}}
                               slots={{
                                 header: <Stack mx={2} direction='row' spacing={2} alignItems='center'><Iconify
                                   icon='CHATBOT' sx={{color: theme.palette.secondary.main}}/><Typography
                                   fontWeight='bold'
                                   variant='h6'>گفت و گو با دستیار کوچی</Typography></Stack>,
                                 nav: null,
                                 main: (
                                   <>
                                     <ChatMessageList
                                       handleSendChatResponse={HandleChatResponse}
                                       resendButtonStatus={resendButtonStatus}
                                       isChatLoading={isChatLoading}
                                       isTicket={IsTicket}
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
      /> : messages?.length > 0 ? <ChatLayout
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
              <IconButton onClick={()=>router.push(paths.dashboard.tickets.root)}>
                <Iconify icon='arrowHeadLeft' sx={{width:16}}/>
              </IconButton>
            </Stack>
          </Stack>,
          nav: null,
          main: (
            <>
              {messages?.length > 0 && (
                <ChatMessageList
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
