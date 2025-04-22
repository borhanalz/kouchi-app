'use client';

import {toast} from "sonner";
import {z as zod} from "zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {ChatLayout} from './layout';
import {Field, Form} from "../hook-form";
import {paths} from "../../routes/paths";
import {useRouter} from "../../routes/hooks";
import {endpoints} from "../../hooks/endPoints";
import {EditCreateRequest} from "../../lib/axios";
import {ChatMessageList} from './chat-message-list';
import {ChatMessageInput} from './chat-message-input';
import {IApiChat, IChat, IChatFormData} from "../../types/chat";

import type {IApiCreateTicket, ICreateTicketFormData, ITicketResponse} from "../../types/tickets";

// ----------------------------------------------------------------------
type ChatType = {
  messages: ITicketResponse[] | IChat[],
  title?: string
}

function IsTicket(messages: ITicketResponse[] | IChat[]): messages is ITicketResponse[] {
  return messages.length > 0 && 'contentType' in messages[0];
}

// -------------------------------------------------------------------------------
export function Chat({title, messages}: ChatType) {
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
  const HandleChatResponse = async () => {
    const lastMessage: IChat = messages[messages.length - 1] as IChat;
    const response = await AddChatResponse({message: chatMessage});
    if (response.status === "ok") {
      setIsChatLoading(true);
      await queryClient?.invalidateQueries({queryKey: ['get-chat-history']});
      setTimeout(async () => {
        await queryClient?.invalidateQueries({queryKey: ['get-chat-history']});
        console.log(messages)
        setIsChatLoading(false);
        if (!IsTicket(messages)) {
          if (lastMessage?.status === "processed" && lastMessage?.role === "user") {
            setResendButtonStatus(true);
          } else {
            setChatMessage("");
          }
        }
        if (lastMessage?.status !== "processed" && lastMessage?.role === "user") {
          setResendButtonStatus(true);
        }
      }, 10000)
    }
  }

  const hasConversation = messages?.length > 0;
  return (
    <>
      {!IsTicket(messages)?<ChatLayout
        slots={{
          header: <Stack mx={2}><Typography fontWeight='bold'
                                            variant='h4'>گفت و گو با دستیار کوچی</Typography></Stack>,
          nav: null,
          main: (
            <>
                <ChatMessageList
                  handleSendChatResponse={HandleChatResponse}
                  resendButtonStatus={resendButtonStatus}
                  isChatLoading={isChatLoading}
                  isTicket={IsTicket(messages)}
                  messages={messages ?? []}
                />
              <ChatMessageInput
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                isChatLoading={isChatLoading}
                addChatResponsePending={addChatResponsePending}
                HandleChatResponse={HandleChatResponse}
                isTicket={IsTicket(messages)}
                isNewTicket={messages?.length < 1}
              />
            </>
          ),
          details: hasConversation && null,
        }}
      />:messages?.length > 0 ? <ChatLayout
        slots={{
          header: <Stack mx={2}><Typography fontWeight='bold'
                                            variant='h4'>{title}</Typography></Stack>,
          nav: null,
          main: (
            <>
              {messages?.length > 0 && (
                <ChatMessageList
                  handleSendChatResponse={HandleChatResponse}
                  resendButtonStatus={resendButtonStatus}
                  isChatLoading={isChatLoading}
                  isTicket={IsTicket(messages)}
                  messages={messages ?? []}
                />
              )}
              <ChatMessageInput
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                isChatLoading={isChatLoading}
                addChatResponsePending={addChatResponsePending}
                HandleChatResponse={HandleChatResponse}
                isTicket={IsTicket(messages)}
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
              <Button type='submit' variant='contained' loading={createTicketPending}>ایجاد تیکت</Button>
            </Stack>
          </Stack>
        </Form>
      </Stack>}
    </>
  );
}
