import React from "react";
import remarkGfm from "remark-gfm";
import {format} from 'date-fns-jalali';
import {useSelector} from "react-redux";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {toPersianNumber} from "../../utils/persian-number";

import type {IChat} from '../../types/chat';
import type {ITicketResponse} from '../../types/tickets';

//--------------------------------------------------------------------------------------------------
type Props = {
  message: ITicketResponse | IChat|any;
  handleSendChatResponse: (message?: string) => void;
};

function isTicketResponse(message: ITicketResponse | IChat ): message is ITicketResponse {
  return 'responderType' in message;
}

export function ChatMessageItem({message, handleSendChatResponse}: Props) {
  const theme = useTheme();

  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <Typography variant="h5" gutterBottom fontWeight="bold" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <Typography variant="h6" gutterBottom fontWeight="bold" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <Typography variant="subtitle1" gutterBottom fontWeight="bold" {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <Typography variant="subtitle2" gutterBottom fontWeight="bold" {...props} />
    ),
    h5: ({ node, ...props }: any) => (
      <Typography variant="body1" gutterBottom fontWeight="bold" {...props} />
    ),
    h6: ({ node, ...props }: any) => (
      <Typography variant="body2" gutterBottom fontWeight="bold" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <Typography variant="body2" sx={{ lineHeight: 1.8, fontFamily: 'Vazir' }} {...props} />
    ),
    strong: ({ node, ...props }: any) => (
      <Typography component="strong" fontWeight="bold" {...props} />
    ),
    em: ({ node, ...props }: any) => (
      <Typography component="em" fontStyle="italic" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }} {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li style={{ marginBottom: '0.5rem' }} {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <Box
        component="blockquote"
        sx={{
          pl: 2,
          borderLeft: `4px solid ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
          fontStyle: 'italic',
          my: 2,
        }}
        {...props}
      />
    ),
    code: ({ node, inline, className, children, ...props }: any) => (
      <Box
        component="code"
        sx={{
          fontFamily: 'monospace',
          backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f4f4f4',
          px: 0.6,
          py: 0.3,
          borderRadius: 1,
          fontSize: '0.85rem',
          color: theme.palette.text.secondary,
        }}
        {...props}
      >
        {children}
      </Box>
    ),
    a: ({ href = '#', children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: 'secondary.main', textDecoration: 'underline' }}
        {...rest}
      >
        {children}
      </Link>
    ),
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <Box sx={{ overflowX: 'auto' }}>
        <table
          {...props}
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: '500px',
          }}
        />
      </Box>
    ),
    th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        {...props}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#fff',
          textAlign: 'center',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
        }}
      />
    ),
    td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        {...props}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
        }}
      />
    ),
  };


  const isTicket = isTicketResponse(message);
  const isUser = isTicket ? message.responderType === 'user' : message.role === "user";

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{mb: 1, color: 'text.disabled', ...(isUser && {mr: 'auto'})}}
    >
       کوچی
    </Typography>
  );
  const renderBody = () => (
    <Stack
      sx={{
        p: 2,
        ...(isTicket
          ? {
            minWidth: 300,
            maxWidth: 500,
          }
          : {
            width: '100%',
          }),
        borderRadius: 1,
        ...(isTicket&&{
        bgcolor: theme.vars.palette.secondary.light}),
        ...(isUser && {color: 'grey.800', bgcolor: theme.palette.primary.main}),
      }}
    >
      {isTicket && message.attachments?.length > 0 ? (
        <Stack spacing={2}>
          <Typography component="div" fontWeight="bold" lineHeight={1.8}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
              {message?.text}
            </ReactMarkdown>
          </Typography>
          <Box
            sx={{
              borderRadius: 1.5,
              cursor: 'pointer',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.vars.palette.primary.main
                  : theme.vars.palette.grey[300],
              p: 1,
              '&:hover': {opacity: 0.9},
            }}
          >
            <Typography variant="caption">
              {toPersianNumber(`${message.attachments?.length} فایل پیوست دارد.`)}
            </Typography>
          </Box>
        </Stack>
      ) : (
       <div style={{fontSize:'13px',color:isUser?'#fff':theme.palette.mode==="dark"?"#fff":'#000',fontFamily:'Vazir',lineHeight:1.8}} color="#fff">
           <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
                   {(message as IChat).content ||(message as ITicketResponse).text ||''}
           </ReactMarkdown>
        </div>
      )}
      {isTicket && (() => {
        const dateValue = isTicket
          ? (message as ITicketResponse).createdAt
          : (message as IChat).timestamp;

        return (
          <Typography variant="subtitle2" fontSize={12} mt={1.5} color={theme.palette.grey[200]}>
            {toPersianNumber(format(dateValue, 'HH:mm'))} ,{' '}
            {toPersianNumber(format(dateValue, 'yyyy-MM-dd'))}
          </Typography>
        );
      })()}
    </Stack>
  );

  if (isTicket ? !message.text : !message.content) {
    return null;
  }

  return (
  <Stack>
    {!isTicket&&!isUser&&<Divider sx={{mb:2,backgroundColor:theme.palette.grey[600],borderStyle:'dashed'}}/>}

    <Box
      sx={{
        mb: 1.5,
        display: isUser?'flex':'unset',
        justifyContent: isUser ? 'unset' : 'flex-end',
      }}
    >
      <Stack alignItems={isTicket?isUser ? 'flex-end' : 'flex-start':'unset'}>
        {!isUser&&renderInfo()}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': {
              '& .message-actions': {opacity: 1},
            },
          }}
        >
          {renderBody()}
        </Box>
        <Stack spacing={2} mt={1.5} sx={{width: '100%'}}>
          {!isTicket && message.options && message.options.map((option:any) => (
            <Button
              onClick={(e) => handleSendChatResponse(e?.currentTarget?.textContent as string)}
              sx={{borderColor:theme.palette.primary.main}}
              fullWidth
              color="primary"
              variant="outlined"
              key={option}
            >
              {toPersianNumber(option)}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Box>
  </Stack>
  );
}
