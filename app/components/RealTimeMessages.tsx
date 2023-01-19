import { useSupabase } from '~/hooks/useSupabase';
import { useState, useEffect } from 'react';
import type { Database } from '~/types/database';

type Message = Database['public']['Tables']['messages']['Row'];

export function RealTimeMessages({
  serverMessages,
}: {
  serverMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(serverMessages);
  const supabase = useSupabase();

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((messages) => [...messages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return <pre>{JSON.stringify(messages, null, 2)}</pre>;
}
