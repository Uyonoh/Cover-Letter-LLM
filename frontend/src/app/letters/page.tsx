"use client";

import { Search, Pencil, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import type { letterBrief } from "@/utils/api";

function Letters() {
    const [headings, setHeadings] = useState<string[]>([]);
    const [letters, setLetters] = useState<letterBrief[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");
        apiFetch("/letters", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    return Promise.reject("Failed to fetch")
                }
            })
            .then((data) => {
                setHeadings(data.headings || []);
                setLetters(data.letters || []);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });

    }, [letters]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-7 justify-center items-center h-64">
                <h1 className="font-bold text-2xl">Just a moment...</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
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
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-background-light text-white/80 border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-secondary">
                <table className="w-full table-auto text-white/80">
                    <thead>
                        <tr className="bg-background-light">
                            {headings.map((heading, key) => (
                                <th key={key} className="px-4 py-3 text-left font-semibold uppercase tracking-wide border-b border-secondary">{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                        {letters.map((letter, key) => (
                            <tr key={key} className="hover:bg-background-dark transition">
                                <td className="px-4 py-3">{letter.jobs.title}</td>
                                <td className="px-4 py-3">{letter.jobs.company}</td>
                                <td className="px-4 py-3">{new Date(letter.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm flex gap-4">
                                    <Link className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer"
                                         href={{
                                            pathname: "/letters/" + letter.id,
                                            // query: { payload: JSON.stringify(letter.id) },
                                        }}>
                                        <Pencil size={16} />
                                        <span>Edit</span>
                                    </Link>
                                    <button className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer">
                                        <Download size={16} />
                                        <span>Download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Letters;
