"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";


export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert("Signup successful! Check your email.");
  }

  const handleLogin = async () => {
    console.log(supabase);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    console.log("Tok:", data.session?.access_token);
    if (error) alert(error.message)
    else router.push("/letters/generate");
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleSignup} className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
      <button onClick={handleLogin} className="bg-green-500 text-white p-2 rounded">
        Log In
      </button>
    </div>
  )
}
