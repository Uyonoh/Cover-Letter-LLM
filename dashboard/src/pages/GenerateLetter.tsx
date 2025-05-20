import React from "react";
import { useState, useEffect } from "react";

function GenerateLetter() {
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/letters/generate-letter",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job_description: jobDescription }),
        }
      );

      const data = await response.json();
      console.log("Success:", data);
      // Update state to display result
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Reset form
      setJobDescription("");
    }
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Generate Letter</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="job_description"
          className="block text-lg font-medium text-gray-700 text-center"
        >
          Enter job description
        </label>

        <textarea
          id="job_description"
          name="job_description"
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        ></textarea>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Generate Letter
          </button>
        </div>
      </form>
    </div>
  );
}

export default GenerateLetter;