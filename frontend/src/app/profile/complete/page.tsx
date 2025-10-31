import { Metadata } from "next";
import CompleteProfileClient from "./CompleteProfileClient";

export const metadata: Metadata = {
  title: "Complete Profile",
  description: "finish setting up your profile.",
};

export default function CompleteProfilePage() {
    return <CompleteProfileClient />;
}
