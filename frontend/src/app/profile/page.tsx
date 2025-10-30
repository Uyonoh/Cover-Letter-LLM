"use client";

import { useState, useEffect } from "react";
import { CloudUpload, FileText, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import Loading from "@/components/Loading";
import { formatFileSize } from "@/utils/helpers";
import type { Resume } from "@/types/resumes";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [career_title, setCareerTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isDeleteResumeDialogOpen, setIsDeleteResumeDialogOpen] = useState(false);

  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  // Set authorization
    const router = useRouter();
    const next = "/profile";

  useEffect(() => {
    const populateProfile = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          return router.push(`/login?next=${next}`);
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, career_title, location, phone_number")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error.message);
        }

        setFirstName(profile?.first_name ?? "");
        setLastName(profile?.last_name ?? "");
        setEmail(session.user.email || "");
        setCareerTitle(profile?.career_title ?? "");
        setPhoneNumber(profile?.phone_number || "");
        setLocation(profile?.location ?? "");

        // Resume
        const { data: resumes } = await supabase
          .from("resumes")
          .select("file_name, file_size, uploaded_at, storage_path");
        setResumes(resumes || []);
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
        phone_number: phoneNumber,
        // updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) {
        console.error("Error updating profile:", error.message);
        alert("Could not save profile.");
      }

      // Update email and phone in auth
      const { error: userError } = await supabase.auth.updateUser({
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

  async function handleUpload(file: File, userId: string) {
    console.log("Uploading file:", file);
    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(`${userId}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true, // overwrite if same name
      });

    if (error) {
      console.error("Upload failed:", error.message);
      alert("Upload failed");
      return;
    }

    console.log("Uploaded:", data);

    const { data: data2, error: error2 } = await supabase.from("resumes")
    .upsert({
      user_id: userId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: `${userId}/${file.name}`,
    })
    .select();

    if (error2) {
      console.error("File registration failed:", error2.message);
      alert("Upload failed");
      return;
    }
    if (data2) setResumes([...resumes, data2[0]]);
    alert("Upload successful!");

    // Kick off background parsing
    console.log("Shceduling parsing");
    apiFetch("/resumes/parse", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        storage_path: `${userId}/${file.name}`,
      }),
    }).catch((err) => console.error("Background parse failed:", err));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("File input changed", e.target.files);
    const file = e.target.files?.[0];
    console.log("File selected", file);
    if (file && file.size <= 5 * 1024 * 1024) {
      if (file) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await handleUpload(file, session?.user.id || "");
      }
    } else {
      alert("File must be under 5MB.");
    }
  }

  async function handleDeleteResume() {
    setIsDeleteResumeDialogOpen(false);
    if (!selectedResume) return;
    const { data, error } = await supabase.storage
      .from("resumes")
      .remove([selectedResume.storage_path]);
    
    if (error) {
      console.error("Error deleting resume from storage:", error.message);
      alert("Could not delete resume.");
      return;
    }

    const { error: dbError } = await supabase.from("resumes")
      .delete()
      .eq("storage_path", selectedResume.storage_path);
    
    if (dbError) {
      console.error("Error deleting resume from table:", dbError.message);
      alert("Could not delete resume.");
      return;
    }
    // refresh UI
    setResumes(resumes.filter(r => r.storage_path !== selectedResume.storage_path));
    setSelectedResume(null);
    // Bug: file is still selected on input, need to file file for onChange
    // cant select file with same name for upload
  }

  async function handleDeleteAccount() {
    setIsDeleteUserDialogOpen(false);
    setIsDeletingUser(true);

    try {
      const response = await apiFetch("/auth/delete-account", {
        method: "POST",
      });

      if (!response.ok) {
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
      setIsDeletingUser(false);
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
          className="flex flex-col sm:grid sm:grid-cols-2  gap-5 py-2 text-white/80"
        >
          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

      {/* Resume */}
      <section className="personal py-5 pb-10 border-b border-secondary" id="resume">
        <h3 className="text-xl font-bold">Your Resume</h3>
        <div className="mt-6">
          <div className="flex items-center justify-center w-full">
            <label
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background-light dark:hover:bg-bray-800 dark:bg-background-dark/50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-background-dark/80` + 
                (resumes.length > 0 ? " hidden": "")}
              htmlFor="dropzone-file"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="material-symbols-outlined text-4xl text-gray-500 dark:text-gray-400">
                  <CloudUpload />
                </span>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOCX (MAX. 5MB)
                </p>
              </div>
              <input
                className="hidden"
                id="dropzone-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="mt-6 rounded-lg bg-background-light p-4 dark:bg-background-dark/50 flex flex-col gap-2">
          {!resumes && <p>No resumes uploaded yet.</p>}
            {resumes.map((resume) => (
              <div
                key={resume.storage_path}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <FileText className="text-primary shrink-0" size={28} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{resume.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(resume.file_size)}
                      <span className="hidden sm:inline"> – Uploaded on </span>
                      <span className="inline sm:hidden"> | </span>
                      {new Date(resume.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white"
                    onClick={async () => {
                      // only fetch signed URL when user clicks
                      const { data } = await supabase.storage
                        .from("resumes")
                        .createSignedUrl(resume.storage_path, 60);
                      window.open(data?.signedUrl, "_blank");
                    }}
                  >
                    <Eye />
                  </button>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-500/10"
                    onClick={(e) => {
                      setSelectedResume(resume);
                      setIsDeleteResumeDialogOpen(true)
                    }}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-gray-200/10 dark:border-gray-700/50"></div>
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
        <div className="flex justify-between items-center px-2 py-5 border border-red-400 rounded-lg bg-red-700/10 ">
          <div className="flex flex-col gap-2">
            <p>Delete Account</p>
            <p className="text-secondary">
              Permanently delete your account and all of your data
            </p>
          </div>
          <button
            className="bg-red-500/80 text-white rounded-lg w-33 h-10 cursor-pointer"
            onClick={(e) => setIsDeleteUserDialogOpen(true)}
          >
            Delete
            <span className="hidden sm:inline"> Account</span>
          </button>
        </div>
      </section>

      {/* Delete confirmation for resume */}
      <DeleteConfirmationDialog
        isOpen={isDeleteResumeDialogOpen}
        onCancel={() => setIsDeleteResumeDialogOpen(false)}
        prompt={` ${selectedResume?.file_name} \n\n Are you sure you want to DELETE this resume? This action CANNOT be undone.`}
        onConfirm={handleDeleteResume}
      />

      {/* Delete confirmation for user profile */}
      <DeleteConfirmationDialog
        isOpen={isDeleteUserDialogOpen}
        onCancel={() => setIsDeleteUserDialogOpen(false)}
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
        isLoading={isDeletingUser}
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
