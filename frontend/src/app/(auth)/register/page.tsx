"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/utils/api";
import Loading from "@/components/Loading";
import { useAuth } from "@/app/hooks/useAuth"

function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [consent, setConsent] = useState(false);
    const [err, setErr] = useState("");
    const { session, signUp } = useAuth();
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
            setErr("Passwords must match! Please comfirm your password.");
            return;
        }

        if (!consent) {
            setErr("Please accept the terms and conditions to proceed!");
            return;
        }

        setIsLoading(true);

        try {
            const { session, error } = await signUp(email, password);

            if (error) {
                setErr(error.message);
            } else if (session) {
                router.push("/profile/complete");
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
            <div className="text-center flex flex-col gap-2">
                <h1 className="font-bold text-2xl">Register a new account</h1>
                <p>Already hasve an account? <Link href="/login" className="text-blue-600">Sign in</Link></p>
            </div>

            {err &&
                <p className="err w-full text-center text-red-400 text-lg">{err}</p>
            }

            <div className="flex flex-col gap-4 text-secondary w-full sm:w-[500px]">
                <div className="flex flex-col gap-4">
                    {/* <input onChange={(e) => setFirstName(e.target.value)} type="text" name="first-name" id="first-name" placeholder="First Name" className="w-full p-2 form-input"/>
                    <input onChange={(e) => setLastName(e.target.value)}  type="text" name="last-name" id="last-name" placeholder="Last Name"    className="w-full p-2 form-input"/> */}
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Email" className="w-full p-2 form-input" required />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Password" className="w-full p-2 form-input" required />
                    <input onChange={(e) => setPassword1(e.target.value)} type="password" name="password1" id="password1" placeholder="Confirm Password" className="w-full p-2 form-input" required />
                </div>
                <div className="remember-forgot flex justify-between">
                    <div className="flex gap-2">
                        <input type="checkbox" name="consent" id="consent"
                            onClick={(e) => setConsent(!consent)}
                            required />
                        <label htmlFor="consent" className="text-white/80">I agree to the the
                            <Link className="text-blue-500 underline" href={"/legal/terms-and-conditions"}>Terms and Conditions</Link>, and {" "}
                            <Link className="text-blue-500 underline" href={"/legal/privacy-policy"}>Privacy Policy</Link>
                        </label>
                    </div>
                    {/* <Link href="/forgot-password" className="text-blue-600">Forgot your password?</Link> */}
                </div>
                <button type="submit"
                    className="rounded-lg text-white p-2 bg-primary w-full cursor-pointer"
                    onClick={handleRegister}
                >Register</button>
            </div>

            <Loading isLoading={isLoading} messages={[
                "Verifying Your Information",
                "Creating your account",
                "Setting up your profile",
                ]} overlay />

        </form>
    );
}

export default Register