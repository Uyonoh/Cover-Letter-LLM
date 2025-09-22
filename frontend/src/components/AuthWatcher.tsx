"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabaseClient"

export default function AuthWatcher() {
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/letters/generate");
      }
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router]);

  return null
}
