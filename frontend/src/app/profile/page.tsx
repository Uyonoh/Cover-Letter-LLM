import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile", // Add user's name
  description: "Manage your profile and document.",
};

export default function ProfilePage() {
    return <ProfileClient />;
}
