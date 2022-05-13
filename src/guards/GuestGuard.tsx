import { ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// redux
import { useSelector } from '../redux/store';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { push } = useRouter();
  const { isAuthenticated } = useSelector((state) => state.session);  
  
  useEffect(() => {
    if (isAuthenticated) {
      push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (isAuthenticated) {
    push('/');
  }

  return <>{children}</>;
}
