"use client";

import { Search, Pencil, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import type { letterBrief } from "@/types/letters";
import DeleteButton from "@/components/DeleteButton";
import Loading from "@/components/Loading";


function Letters() {
    const [headings, setHeadings] = useState<string[]>([]);
    const [letters, setLetters] = useState<letterBrief[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLetters = async () => {
            try {
                const res = await apiFetch("/letters")
                if (!res.ok) throw new Error(await res.text())
                const data = await res.json()
                setHeadings(data.headings || [])
                setLetters(data.letters || [])
            } catch (err) {
                console.error("Fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }
        loadLetters()
    }, []);

    // filtered list (wire in debounce as you like)
    const filtered = letters.filter((l) =>
        l.jobs?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <Loading isLoading={isLoading} messages={["Just a moment..."]} />
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
                                <th key={key} className="px-4 py-3 text-left font-semibold uppercase tracking-wide border-b border-secondary">{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                        {filtered.map((letter) => (
                            <tr key={letter.id} className="hover:bg-background-dark transition">
                                <td className="px-4 py-3">{letter.jobs.title}</td>
                                <td className="px-4 py-3">{letter.jobs.company}</td>
                                <td className="px-4 py-3">{new Date(letter.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm flex gap-4">
                                    <Link className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer"
                                        href={{
                                            pathname: "/letters/" + letter.id,
                                            // query: { payload: JSON.stringify(letter.id) },
                                        }}>
                                        <Pencil size={20} />
                                        <span className="hidden sm:block">Edit</span>
                                    </Link>
                                    <Link href="#"
                                        className="hover:underline hover:text-primary flex gap-2 items-center cursor-pointer">
                                        <Download size={20} />
                                        <span className="hidden sm:block">Download</span>
                                    </Link>
                                    <DeleteButton id={letter.id} table="cover_letters" text="Delete" 
                                     onDeleted={() => setLetters(prev => prev.filter(l => l.id !== letter.id))} />
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
