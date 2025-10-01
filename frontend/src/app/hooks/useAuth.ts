import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import type {
  Session,
  AuthChangeEvent,
  Provider,
  AuthError,
} from '@supabase/supabase-js'

function useAuth() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession()
        .then(({data, error}) => {
            setSession(data.session);
        })

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            // Sync the access token into an HttpOnly cookie via API route
            if (session) {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({"access_token": session.access_token}),
                });
            } else {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                    method: "DELETE",
                });
            }
        });
        return () => data.subscription.unsubscribe();
    }, []);

    // Sign in with email/password
    const signIn = async (
      email: string,
      password: string
    ): Promise<{ session: Session | null; error: AuthError | null }> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { session: data.session, error }
    }
  
    // Sign in with OAuth provider
    const signInWithProvider = async (
      provider: Provider
    ): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      return { error }
    }
  
    // Sign up new user
    const signUp = async (
      email: string,
      password: string
    ): Promise<{ session: Session | null; error: AuthError | null }> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { session: data.session, error }
    }
  
    // Sign out and clear cookie
    const signOut = async (): Promise<void> => {
      await supabase.auth.signOut()
      await fetch('/api/auth', { method: 'DELETE' })
      setSession(null)
    }
  
    return {
      session,
      signIn,
      signInWithProvider,
      signUp,
      signOut,
    }
}

export { useAuth };