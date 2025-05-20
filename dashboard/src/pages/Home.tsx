import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="px-4 py-12 my-10 text-center bg-white">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
        Easy Letter
      </h1>

      <div className="mt-6 max-w-2xl mx-auto">
        <p className="text-lg text-gray-600 mb-6">
          Get a custom letter in no time. We'll help you create a letter that's
          tailored to your needs. It's easy to use, and you can customize it to
          your liking.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/letters/generate-letter">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-md shadow"
            >
              Generate Letter
            </button>
          </Link>

          <Link to="/letters">
            <button
              type="button"
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-lg font-semibold py-3 px-6 rounded-md"
            >
              View Letters
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
