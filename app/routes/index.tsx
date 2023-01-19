import { Form, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Login } from '~/components/Login';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { RealTimeMessages } from '~/components/RealTimeMessages';

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.from('messages').select();
  return json({ messages: data ?? [] }, { headers: response.headers });
};

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const formData = await request.formData();
  const { message } = Object.fromEntries(formData);

  await supabase.from('messages').insert({ message: String(message) });

  return json({ message: 'ok' }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <main className='gird grid-cols-3 p-4 h-screen'>
      <nav className='flex justify-between mb-4'>
        <h1 className='text-3xl font-bold'>KikinDB Remix Chat</h1>
        <Login />
      </nav>

      <RealTimeMessages serverMessages={messages} />

      <Form method='post' className='mb-4 flex'>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          name='message'
        />
        <button
          className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
          type='submit'
        >
          Send Message
        </button>
      </Form>
    </main>
  );
}
