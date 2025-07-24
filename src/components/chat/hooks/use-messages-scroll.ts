import { useRef, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseMessagesScrollReturn = {
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

/**
 * @param messages - لیست پیام‌ها
 * @param shouldAutoScroll - فقط اگر true باشد اسکرول به پایین انجام می‌شود (برای تیکت‌ها فعال باشد، برای چت غیرفعال)
 */
export function useMessagesScroll(messages: any, shouldAutoScroll: boolean = true): UseMessagesScrollReturn {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll) return;

    if (!messages) return;

    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return { messagesEndRef };
}
