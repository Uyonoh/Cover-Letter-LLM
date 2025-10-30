'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { apiFetch } from '@/utils/api';
import Loading from '@/components/Loading';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const syncSession = async () => {
      try {
        const next = searchParams?.get('next') || '/letters';

        // Get current Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          if (!cancelled) router.replace('/login');
          return;
        }

        // Sync session with backend
        await apiFetch('/auth', {
          method: 'POST',
          body: JSON.stringify({ access_token: session.access_token }),
        });

        // Check for completed profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          // You could route to an error page here if desired
          return;
        }

        if (!profile?.first_name || !profile?.last_name) {
          if (!cancelled) router.replace('/profile/complete');
        } else {
          console.log('Redirecting from callback to', next);
          if (!cancelled) router.replace(next);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        if (!cancelled) router.replace('/error');
      }
    };

    syncSession();

    // Cleanup to prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <Loading
      isLoading
      overlay
      messages={[
        'Fetching your session',
        'Syncing your data',
        'Just a moment',
      ]}
    />
  );
}
