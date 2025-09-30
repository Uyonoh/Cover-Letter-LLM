"use client";

import type { apiError } from "@/utils/api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/utils/api";

function Register() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [err, setErr] = useState("");
    const router = useRouter();

    function matchPassword() {
        if (password === password1) {
            return true;
        }
        return false;
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setErr("");

        if (!matchPassword()) {
            setErr("Passwords must match! Please comfirm your password");
            return;
        }

        try {
            const res = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({first_name, last_name, email, password}),
            });

            if (!res.ok) {
                const error: apiError = await res.json()
                setErr(error.message);
            } else {
                const data = await res.json();
                localStorage.setItem("access_token", data.access_token);
                router.push("/profile");
            }

        } catch (err: unknown) {
            setErr("Network error, try again later");
            console.log("ERR: ", err);
        }
    }

    return (
        <form action="" className="form-container flex flex-col justify-center items-between gap-5">
            <div className="text-center flex flex-col gap-2">
                <h1 className="font-bold text-2xl">Register a new account</h1>
                <p>Already hasve an account? <Link href="/login" className="text-blue-600">Sign in</Link></p>
            </div>

            {err && 
            <p className="err w-full text-center text-red-400 text-lg">{err}</p>
            }

            <div className="flex flex-col gap-4 text-secondary w-full sm:w-[500px]">
                <div className="flex flex-col gap-4">
                    <input onChange={(e) => setFirstName(e.target.value)} type="text" name="first-name" id="first-name" placeholder="First Name" className="w-full p-2 form-input"/>
                    <input onChange={(e) => setLastName(e.target.value)}  type="text" name="last-name" id="last-name" placeholder="Last Name"    className="w-full p-2 form-input"/>
                    <input onChange={(e) => setEmail(e.target.value)}     type="email" name="email" id="email" placeholder="Email"               className="w-full p-2 form-input"/>
                    <input onChange={(e) => setPassword(e.target.value)}  type="password" name="password" id="password" placeholder="Password"   className="w-full p-2 form-input"/>
                    <input onChange={(e) => setPassword1(e.target.value)} type="password" name="password1" id="password1" placeholder="Confirm Password"   className="w-full p-2 form-input"/>
                </div>
                <div className="remember-forgot flex justify-between">
                    <div className="flex gap-2">
                        <input type="checkbox" name="remember" id="remember" />
                        <label htmlFor="remember">I have read and ...</label>
                    </div>
                    {/* <Link href="/forgot-password" className="text-blue-600">Forgot your password?</Link> */}
                </div>
                <button type="submit"
                    className="rounded-lg text-white p-2 bg-primary w-full cursor-pointer"
                    onClick={handleRegister}
                >Register</button>
            </div>

            

        </form>
    );
}

export default Register