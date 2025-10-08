"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Loading from "@/components/Loading";



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");
    const {session, signIn, signUp, signOut} = useAuth();
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setIsLoading(true);

        try {
            const { session, error } =  await signIn(
                email,
                password,
            )

            if (error) {
                setErr(error.message);
            } else if(session) {
                router.push("/letters");
            }

        } catch (err: unknown) {
            setErr("Network error, try again later");
            console.error(err);
        } finally {
            setIsLoading(false);
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

            <Loading isLoading={isLoading} messages={[
                "Signing you in",
                "Verifying Your Identity",
                "Syncing your data",
                ]} overlay />
        </form>
    );
}

export default Login