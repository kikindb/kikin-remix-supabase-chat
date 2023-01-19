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
    <main>
      <h1>KikinDB Remix Chat</h1>
      <Login />
      <Form method='post'>
        <input type='text' name='message' />
        <button type='submit'>Send Message</button>
      </Form>
      <RealTimeMessages serverMessages={messages} />
    </main>
  );
}
