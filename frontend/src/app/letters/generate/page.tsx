import type { Metadata } from 'next';
import GenerateClient from './GenerateClient';

export const metadata: Metadata = {
  title: "Generate Cover Letter",
  description: "Create a tailored AI-powered cover letter in seconds.",
};


export default function GeneratePage() {
  return <GenerateClient />;
}