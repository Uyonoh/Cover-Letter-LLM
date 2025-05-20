import React from "react";

import { useLetters } from "../hooks/useLetters";

function Letters() {
  const { letters, loading, error } = useLetters();

  return (
    <div className="px-4 py-12 my-10 text-center bg-white">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
        Your Cover Letters
      </h1>
      <div className="mt-8 space-y-4">
        {loading && <p className="text-gray-500">Loading letters...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && letters.length === 0 && (
          <p className="text-gray-500">No letters found.</p>
        )}

        {!loading &&
          !error &&
          letters.map((letter) => {
            return (
              <div
                key={letter.id}
                className="p-4 text-left border rounded-lg shadow-sm bg-gray-50"
              >
                {/* <h2 className="text-xl font-semibold">{letter.title}</h2> */}
                <p className="mt-2 text-gray-700">{letter.content}</p>
                <p className="mt-1 text-sm text-gray-400">
                  Created: {new Date(letter.created_at).toLocaleString()}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Letters;
