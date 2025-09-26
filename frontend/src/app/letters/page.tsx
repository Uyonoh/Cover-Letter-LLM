"use client";

import { Search, Pencil, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import type { letterBrief } from "@/utils/api";

function Letters() {
    const [headings, setHeadings] = useState<string[]>([]);
    const [letters, setLetters] = useState<letterBrief[]>([]);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");
        apiFetch("/letters", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch")))
            .then((data) => {
                setHeadings(data.headings || []);
                setLetters(data.letters || []);
            })
            .catch((err) => console.error(err));
    }, []);

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
                                    <button className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer">
                                        <Pencil size={16} />
                                        <span>Edit</span>
                                    </button>
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
