"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import type { letterBrief } from "@/utils/api";

function Letters() {
    const [headings, setHeadings] = useState([]);
    const [letters, setLetters] = useState<letterBrief[]>([]);
    useEffect(() => {
        const access_token =  localStorage.getItem("access_token");
        apiFetch("/letters", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }).then((res) => {
            if(res.ok) {
                return res.json();
            }
        }).then((data) => {
            setHeadings(data.headings);
            setLetters(data.letters);
        })

    }, []);

    return (
        <div className="py-5 px-5 sm:px-7 md:px-10">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">My Cover Letters</h1>
                <label htmlFor="">
                    <Search />
                    <input type="search" name="" id="" placeholder="Search" />
                </label>
            </div>

            {/* Letters */}
            <table className=" border-primary text-white/80 rounded-lg w-full">
                <thead className="w-full bg-background-light">
                    <tr>
                        {headings.map((heading, key) => {
                            return (
                                <td key={key} >{heading}</td>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {letters.map((letter, key) => {
                        return (
                            <tr key={key} className="border-b border-primary">
                                <td className="border-t border-primary">{letter.jobs.title}</td>
                                <td className="border-t border-primary">{new Date(letter.created_at).toLocaleDateString()}</td>
                                <td className="border-t border-primary flex justify-end gap-5">
                                    <button>Edit</button>
                                    <button>Download</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Letters;