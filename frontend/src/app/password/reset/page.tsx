"use client";

import { supabase } from "@/utils/supabaseClient";
import { useState, useEffect } from "react";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");

  function verifyPasswords(){
    if (password === password1) {
      return true;
    }

    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Might need to check if user exists
    if (!verifyPasswords()) {
      console.error("Invalid passords");
      return;
    }

    const { data, error } = await supabase.auth
    .updateUser({ password })

    if (error) {
      alert(error.message);
    }
    if (data) alert("Password updated successfully!")
    console.log(data);
    console.log(error);

    // useEffect(() => {
    //   supabase.auth.onAuthStateChange(async (event, session) => {
    //     if (event == "PASSWORD_RECOVERY") {
    //       const newPassword = prompt("What would you like your new password to be?")!;
    //       const { data, error } = await supabase.auth
    //         .updateUser({ password: newPassword })
    //       if (data) alert("Password updated successfully!")
    //       if (error) alert("There was an error updating your password.")
    //     }
    //   })
    // }, [])
  }

  return (
    <div>
      <h1 className="text-2xl">Reset yout password</h1>
      <p className="py-2">Enter a new password</p>

      <form onSubmit={handleSubmit} className="py-5 flex flex-col gap-4">
        <label htmlFor="password" className="flex gap-2">
          
          <input
            type="password"
            name="password"
            placeholder="Secure password"
            className="form-input"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label htmlFor="password1" className="flex gap-2">
          
          <input
            type="password"
            name="password1"
            placeholder="Secure password again"
            className="form-input"
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>

        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 max-w-[250px] hover:bg-primary/70"
          >
            Change password
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
