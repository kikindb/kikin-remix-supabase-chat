import { useOutletContext } from '@remix-run/react';

export const useSession = () => {
  const { serverSession } = useOutletContext();
  return serverSession;
};
