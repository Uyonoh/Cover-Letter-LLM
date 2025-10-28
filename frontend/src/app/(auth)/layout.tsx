"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

function AuthLayout(
    {children}: Readonly<{children: React.ReactNode}>
) {
    const router = useRouter();
    const { signInWithProvider } = useAuth();
    
    function SignInWIthGoogle() {
        const error = signInWithProvider(
            "google",
            {
                redirectTo: "http://localhost:3000/auth/callback",
            });

        if (!error) {
            router.push("/letters");
        }
    }

    function SignInWIthGithub() {
        const error = signInWithProvider(
            "github",
            {
                redirectTo: "http://localhost:3000/auth/callback",
            });

        if (!error) {
            router.push("/letters");
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-[90vh]">
            <div className="flex flex-col justify-between items-center gap-5">
                {children}
                <span className="w-full grid grid-cols-3 text-center items-center text-secondary">
                    <div className="h-[1px] border border-secondary"></div>
                    <span>Or continue with</span>
                    <div className="h-[1px] border border-secondary"></div>
                </span>
                <div className="flex gap-4 w-full px-2">
                    <button
                        className=" flex justify-center items-center gap-1 rounded-lg text-white p-2 w-full cursor-pointer bg-[#0d151c] border border-secondary"
                        onClick={(e) => SignInWIthGoogle()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span>Google</span>
                    </button>
                    <button
                        className=" flex justify-center items-center gap-1 rounded-lg text-white p-2 w-full cursor-pointer bg-[#0d151c] border border-secondary"
                        onClick={(e) => SignInWIthGithub()}
                    >
                        <svg role="img" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="GitHub"><title>GitHub</title> <path   fill="#ffffff"   d="M12 .296c-6.63 0-12 5.373-12 12 0 5.303   3.438 9.8 8.205 11.387.6.113.82-.261.82-.58   0-.287-.01-1.05-.016-2.061-3.338.726-4.042-1.61-4.042-1.61   -.546-1.387-1.334-1.757-1.334-1.757-1.089-.745.083-.73.083-.73   1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.806 1.304 3.492   .997.108-.775.418-1.304.761-1.604-2.665-.303-5.466-1.334-5.466   -5.931 0-1.31.469-2.381 1.235-3.221-.124-.303-.535-1.523.117   -3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404   c1.018.005 2.043.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23   .655 1.653.244 2.873.12 3.176.77.84 1.233 1.911 1.233 3.221   0 4.609-2.807 5.624-5.479 5.921.43.371.815 1.102.815 2.222   0 1.604-.015 2.896-.015 3.293 0 .322.216.699.825.58C20.565   22.092 24 17.596 24 12.296c0-6.627-5.373-12-12-12Z" />
                        </svg>

                        <span>Github</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;