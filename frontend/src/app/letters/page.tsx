"use client";

import { Search, Pencil, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import type { letterBrief } from "@/types/letters";
import DeleteButton from "@/components/DeleteButton";
import Loading from "@/components/Loading";

function Letters() {
  const [letters, setLetters] = useState<letterBrief[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of rows per page
  const headings = [
    "Job Title",
    "Company",
    "Created",
    "Actions",
  ];

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const res = await apiFetch("/letters");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setLetters(data.letters || []);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        setError("Failed to load letters.");
      } finally {
        setIsLoading(false);
      }
    };
    loadLetters();
  });

  // Filter by job title or company
  const filtered = letters.filter((l) =>
    [l.jobs?.title, l.jobs?.company]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // useEffect(() => {
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);
  // }, [filtered, currentPage]);

  function downloadLetter(letter: letterBrief) {
    // Construct the text content
    const content = `Job Title: ${letter.jobs.title}
        Company: ${letter.jobs.company}
        Date: ${new Date(letter.created_at).toLocaleDateString()}

        ${letter.content || ""}`;

    // Create a blob and a temporary link
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${letter.jobs.title.replace(/\s+/g, "_")}_cover_letter.txt`;
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return <Loading isLoading={isLoading} messages={["Just a moment..."]} />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        {error}
        <button
          onClick={() => location.reload()}
          className="ml-4 underline hover:text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-5 px-5 sm:px-7 md:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">My Cover Letters</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="search"
            placeholder="Search by title or company"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-background-light text-white/80 border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary">
        <table className="w-full table-auto text-white/80">
          <thead>
            <tr className="bg-background-light">
              {headings.map((heading, key) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left font-semibold uppercase tracking-wide border-b border-secondary"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={headings.length}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No letters found.{" "}
                  <Link
                    href="/letters/generate"
                    className="underline text-primary"
                  >
                    Generate one
                  </Link>
                  .
                </td>
              </tr>
            ) : (
              paginated.map((letter) => (
                <tr
                  key={letter.id}
                  className="hover:bg-background-dark transition"
                >
                  <td className="px-4 py-3">{letter.jobs.title}</td>
                  <td className="px-4 py-3">{letter.jobs.company}</td>
                  <td className="px-4 py-3">
                    {new Date(letter.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-4">
                    <Link
                      aria-label="Edit letter"
                      className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer"
                      href={`/letters/${letter.id}`}
                    >
                      <Pencil size={20} />
                      <span className="hidden sm:block">Edit</span>
                    </Link>
                    <button
                      aria-label="Download letter"
                      className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer"
                      onClick={() => downloadLetter(letter)}
                    >
                      <Download size={20} />
                      <span className="hidden sm:block">Download</span>
                    </button>
                    <DeleteButton
                      id={letter.id}
                      table="cover_letters"
                      text="Delete"
                      onDeleted={() =>
                        setLetters((prev) =>
                          prev.filter((l) => l.id !== letter.id)
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded border border-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded border border-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Letters;
