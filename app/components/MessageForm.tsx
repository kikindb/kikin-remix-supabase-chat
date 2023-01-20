import { useRef } from 'react';
import { Form } from '@remix-run/react';

export default function MessageForm() {
  const messageInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClick = (event: React.MouseEvent) => {
    console.log(messageInput);
    setTimeout(() => {
      formRef.current?.reset();
      messageInput.current?.focus();
    }, 100);
  };
  return (
    <div>
      <Form method='post' className='flex mb-4' ref={formRef}>
        <input
          className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          type='text'
          name='message'
          ref={messageInput}
        />
        <button
          className='px-4 py-2 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded hover:bg-blue-400 hover:border-blue-500'
          type='submit'
          onClick={handleClick}
        >
          Send Message
        </button>
      </Form>
    </div>
  );
}
