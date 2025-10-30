import { Suspense } from 'react';
import AuthLayout from './AuthLayout';
import Loading from '@/components/Loading';

export default function AuthPageLayout(
    {children}: Readonly<{children: React.ReactNode}>
) {
  return (
    <Suspense
      fallback={
        <Loading
          isLoading
        />
      }
    >
      <AuthLayout>
        {children}
        </AuthLayout>
    </Suspense>
  );
}
