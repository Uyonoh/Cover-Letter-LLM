import { Metadata } from "next";
import ViewLettersClient from "./ViewLettersClient";
import { View } from "lucide-react";

export const metadata: Metadata = {
  title: "View Letters",
  description: "View, edit, download, or delete your letters.",
};


export default function ViewLettersPage() {
    return <ViewLettersClient />;
}