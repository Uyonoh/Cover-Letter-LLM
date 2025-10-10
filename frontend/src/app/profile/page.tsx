"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import Loading from "@/components/Loading";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [career_title, setCareerTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const populateProfile = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          return router.push("/login");
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, career_title, location")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error.message);
        }

        setFirstName(profile?.first_name ?? "");
        setLastName(profile?.last_name ?? "");
        setEmail(session.user.email || "");
        setCareerTitle(profile?.career_title ?? "");
        setPhoneNumber(session.user.phone || "");
        setLocation(profile?.location ?? "");

      } finally {
        setIsLoading(false);
      }
    };

    populateProfile();
  }, [router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return router.push("/login");
      }

      const updates = {
        first_name: firstName,
        last_name: lastName,
        career_title,
        location,
        // updated_at: new Date(),
      };

      const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id)

      if (error) {
        console.error("Error updating profile:", error.message);
        alert("Could not save profile.");
      } 

      // Update email and phone in auth
      const { error:userError } = await supabase.auth.updateUser({
        email: email,
        // phone: phoneNumber,
      });

      if (userError) {
        console.error("Error updating profile:", userError.message);
        alert("Could not save profile.");
      } else {
        alert("Profile updated successfully!");
      }
      
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeleteDialogOpen(false);
    setIsDeleting(true);
    
    try {
      const response = await apiFetch("/auth/delete-account", {
        method: "POST",
      });

      if(!response.ok){
        const err = await response.text();
        console.error("Error deleting account:", err);
        alert(`Failed to delete account: ${err}`);
        return;
      }

      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
      return;
    } finally { 
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col w-full py-5 px-5 sm:px-7 md:px-10">
      <h1 className="font-bold text-4xl leading-tighter">Profile & Settings</h1>

      {/* Personal Info */}
      <section className="personal py-5 pb-10 border-b border-secondary">
        <h3 className="text-xl font-bold">Personal Information</h3>

        <form
          onSubmit={handleSaveProfile}
          className="sm:grid grid-cols-2 gap-5 py-2 text-secondary"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              name="first-name"
              className="form-input"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              name="last-name"
              className="form-input"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="career-title">Career Title</label>
            <input
              type="text"
              name="career-title"
              className="form-input"
              placeholder="eg. Software Engineer"
              value={career_title}
              onChange={(e) => setCareerTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form-input"
              placeholder="eg. +1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="eg. San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {/* submit */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
{/*
      Account settings
      <section className="account-settings flex flex-col w-full py-5 pb-10 border-b border-secondary">
        <h3 className="font-bold text-xl">Account Settings</h3>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-7 py-2">
          <div className="password flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              className="form-input"
            />
          </div>
          <div className="notifications col-start-1 flex justify-between px-2 items center">
            <div className="flex flex-col gap-2">
              <p>Email Notifications</p>
              <p className="text-secondary">Recieve news, updates, and tips</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="email-notifications"
                id="email-notifications"
                className="peer sr-only"
              />
              <label
                htmlFor="email-notifications"
                className="relative flex w-11 h-6 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-primary after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-300 peer-checked:after:translate-x-5"
              ></label>
            </div>
          </div>
        </div>
      </section>
 
      Subscription
      <section className="subscription py-5 pb-10 border-b border-secondary">
        <h3 className="font-bold text-xl">Subscription</h3>
        <div className="flex flex-1 flex-col px-2 py-2 gap-3">
          <p>
            You are on the <span className="text-primary">Free</span> plan.
            Upgrade to unlock more features.
          </p>
          <button className="bg-primary/90 text-white px-4 py-2 max-w-[130px] rounded-lg cursor-pointer">
            Upgrade Plan
          </button>
        </div>
      </section>

      //Data Privacy
      <section className="data-privacy py-5 pb-10 border-b border-secondary">
        <h3 className="font-bold text-xl">Data Privacy</h3>
        <div className="flex justify-between py-2">
          <div className="flex flex-col gap-2 px-2">
            <p>Privacy Setings</p>
            <p className="text-secondary">
              Review and manage your data privacy settings
            </p>
          </div>
          <button className="bg-primary/30 text-primary rounded-lg w-20 h-10 cursor-pointer">
            Manage
          </button>
        </div>
      </section> */}

      {/* Delete Account */}
      <section className="delete-account py-5">
        <h3 className="font-bold text-xl text-red-500 py-2">Danger Zone</h3>
        <div className="flex justify-between px-2 py-5 border border-red-400 rounded-lg bg-red-700/10 ">
          <div className="flex flex-col gap-2">
            <p>Delete Account</p>
            <p className="text-secondary">
              Permanently delete your account and all of your data
            </p>
          </div>
          <button className="bg-red-500/80 text-white rounded-lg w-33 h-10 cursor-pointer"
          onClick={(e) => setIsDeleteDialogOpen(true)}
          >
            Delete Account
          </button>
        </div>
      </section>

      <DeleteConfirmationDialog
      isOpen={isDeleteDialogOpen}
      onCancel={() => setIsDeleteDialogOpen(false)}
      prompt="Are you sure you want to DELETE your account? This action CANNOT be undone."
      onConfirm={handleDeleteAccount}
      />

      <Loading
        isLoading={isLoading}
        messages={[
          "Fetching Profile Data",
          "Validating Information",
          "Just a moment",
        ]}
        overlay
      />

      <Loading
        isLoading={isDeleting}
        messages={[
          "Fetching Profile",
          "Shredding Information",
          "Sending you off",
        ]}
        // color="danger"
        overlay
      />
    </div>
  );
}

export default Profile;
