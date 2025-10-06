// pages/auth/callback.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { apiFetch } from '@/utils/api';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="flex flex-col gap-7 justify-center items-center h-64">
            <h1 className="font-bold text-2xl">Loading your portal...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
    </div>
  )
}
