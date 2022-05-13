import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from '../redux/store';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { isAuthenticated, address } = useSelector((state) => state.session);

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      setRequestedLocation(null);
      push(requestedLocation);
    }
  }, [pathname, push, requestedLocation]);

  if (!isAuthenticated || !address) {
    push('/login');
  }

  return <>{children}</>;
}

