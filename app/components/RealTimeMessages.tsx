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
    <div className='flex flex-col gap-3 mb-4'>
      {messages.map((message) => (
        <div
          className='bg-slate-700 rounded-lg px-4 py-4 ring-1 ring-slate-900/5 shadow-xl'
          key={message.id}
        >
          <h2>@{message.user_id}</h2>
          <p className='text-white mt-2 text-sm'>{message.message}</p>
          <p className='text-slate-400 mt-2 text-xs'>{message.created_at}</p>
        </div>
      ))}
    </div>
  );
}
