// pages/auth/callback.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { apiFetch } from '@/utils/api';
import Loading from '@/components/Loading';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        await apiFetch('/auth', {
          method: 'POST',
          body: JSON.stringify({ access_token: session.access_token }),
        })
        
        // Check profile
        const { data: profile, error  } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle()
          
        
        if (error) {
          console.error('Error fetching profile:', error.message)
          // return router.replace('/error')
        }

        if (!profile?.first_name || !profile?.last_name) {
          router.replace('/profile/complete')
        } else {
          router.push('/letters')
        }

      } else {
        router.push('/login');
      }
    };

    syncSession();
  });

  return (
    <Loading isLoading messages={[
      "Fetching your session",
      "Syncing your data",
      "Just a moment",
    ]} overlay />
  )
}
