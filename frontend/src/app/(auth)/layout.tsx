import { Suspense } from 'react';
import type { Metadata } from 'next';
import AuthLayout from './AuthLayout';
import Loading from '@/components/Loading';

export const metadata: Metadata = {
  title: "Authorization",
  description: "Sign in or create a new account.",
};

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
