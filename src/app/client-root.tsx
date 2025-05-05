'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    window.onerror = function () {
      router.push('/error');
    };

    window.onunhandledrejection = function () {
      router.push('/error');
    };
  }, [router]);

  return <>{children}</>;
}
