import type { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useSupabase } from '~/hooks/useSupabase';

export function Login() {
  const [user, setUser] = useState<User | null>();
  const supabase = useSupabase();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log('Error al cerrar sesion', error);
  };

  const handleLogIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.log('Error al iniciar sesion', error);
  };

  useEffect(() => {
    //console.log(supabase.auth);
    async function getUser() {
      const user = await supabase.auth.getUser();
      console.log(user.data.user);
      setUser(() => user?.data?.user);
    }
    getUser();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {user ? (
        <button onClick={handleLogOut}>Log out</button>
      ) : (
        <button onClick={handleLogIn}>Log in</button>
      )}
    </div>
  );
}
