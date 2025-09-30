"use client";

import type { apiError } from "@/utils/api";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [err, setErr] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setIsProcessing(true);

        try {
            const res = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({email, password}),
            });

            if (!res.ok) {
                const error: apiError = await res.json()
                setErr(error.message);
            } else {
                const data = await res.json();
                localStorage.setItem("access_token", data.access_token);
                router.push("/letters");
            }

        } catch (err: unknown) {
            setErr("Network error, try again later");
            console.log("ERR: ", err);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <form action="" className="form-container flex flex-col justify-center items-between gap-5">
            <div className="text-center">
                <h1 className="font-bold text-2xl">Sign in to your account</h1>
                <p>or <Link href="/register" className="text-blue-600">Create a new account</Link></p>
            </div>

            {err && 
            <p className="err w-full text-center text-red-400 text-lg">{err}</p>
            }

            <div className="flex flex-col gap-4 text-secondary w-full sm:w-[500px]">
                <div className="flex flex-col gap-4">
                    <input type="email" name="email" id="email" placeholder="Email"             className="w-full p-2 form-input"
                     onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" name="password" id="password" placeholder="Password" className="w-full p-2 form-input"
                     onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="remember-forgot flex justify-between">
                    <div className="relative flex gap-2">
                        <input type="checkbox" name="remember" id="remember"
                            className=""/>
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <Link href="/forgot-password" className="text-blue-600">Forgot your password?</Link>
                </div>
                <button type="submit"
                    className="rounded-lg text-white p-2 bg-primary w-full cursor-pointer"
                    onClick={handleLogin}
                >Sign In</button>
            </div>

            {isProcessing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="flex flex-col gap-7 justify-center items-center h-64">
                        <h1 className="font-bold text-2xl">Verifying your identity...</h1>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
                    </div>
                </div>
            )}
        </form>
    );
}

export default Login