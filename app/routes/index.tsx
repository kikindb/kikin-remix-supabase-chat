import { useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Login } from '~/components/Login';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { RealTimeMessages } from '~/components/RealTimeMessages';
import MessageForm from '~/components/MessageForm';

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const formData = await request.formData();
  const { message } = Object.fromEntries(formData);

  await supabase.from('messages').insert({ message: String(message) });

  return json({ message: 'ok' }, { headers: response.headers });
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.from('messages').select();
  return json({ messages: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <main className='grid  grid-rows-[5%_85%_10%] h-screen p-4'>
      <nav className='flex justify-between row-span-1 mb-4'>
        <h1 className='text-3xl font-bold'>KikinDB Remix Chat</h1>
        <Login />
      </nav>

      <RealTimeMessages serverMessages={messages} />

      <MessageForm />
    </main>
  );
}
