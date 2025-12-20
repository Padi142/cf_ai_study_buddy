"use client";

import { useState } from "react";

// In production, this should be your deployed worker URL
const AGENT_WORKER_URL =
  process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:8787";

export default function HomePage() {
  const [response, setResponse] = useState<{
    counter: number;
    lastUpdated: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const callAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${AGENT_WORKER_URL}/agents/studybuddyagent/mlem`,
        {
          method: "POST",
        },
      );
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error calling agent:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-bold">Study Buddy Agent</h1>

        <button
          onClick={callAgent}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Calling Agent..." : "Call Agent"}
        </button>

        {response && (
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <p className="text-lg">
              Counter: <span className="font-bold">{response.counter}</span>
            </p>
            {response.lastUpdated && (
              <p className="text-sm text-gray-400">
                Last updated: {new Date(response.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
