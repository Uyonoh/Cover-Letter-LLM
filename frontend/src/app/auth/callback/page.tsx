import { Suspense } from 'react';
import AuthCallback from './AuthCallback';
import Loading from '@/components/Loading';

export default function Page() {
  return (
    <Suspense
      fallback={
        <Loading
          isLoading
          overlay
          messages={[
            'Fetching your session',
            'Syncing your data',
            'Just a moment',
          ]}
        />
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
