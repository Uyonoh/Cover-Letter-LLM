import { Metadata } from "next";
import LetterViewClient from "./LetterViewClient";

export const metadata: Metadata = {
  title: "Edit Letter", // Replace with job title
  description: "View or modify your letter.",
};

export default function LetterViewPage() {
    return <LetterViewClient />;
}