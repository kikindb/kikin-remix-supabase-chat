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

  return (
    <div className='flex flex-col gap-3 mb-4 overflow-auto'>
      {messages.map((message) => (
        <div
          className='px-4 py-4 rounded-lg shadow-xl bg-slate-700 ring-1 ring-slate-900/5'
          key={message.id}
        >
          <h2>@{message.user_id}</h2>
          <p className='mt-2 text-sm text-white'>{message.message}</p>
          <p className='mt-2 text-xs text-slate-400'>{message.created_at}</p>
        </div>
      ))}
    </div>
  );
}
