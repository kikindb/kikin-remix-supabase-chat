import { useSupabase } from '~/hooks/useSupabase';

export function Login() {
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

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button onClick={handleLogOut}>Log out</button>
      <button onClick={handleLogIn}>Log in</button>
    </div>
  );
}
