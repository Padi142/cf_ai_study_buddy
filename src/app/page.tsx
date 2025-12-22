"use client";

import { useAgent } from "agents/react";
import { useState } from "react";
import { ChatInterface } from "./agent";

// In production, this should be your deployed worker URL
const AGENT_WORKER_URL =
  process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:8787";

export default function HomePage() {
  const [response, setResponse] = useState<{
    counter: number;
    lastUpdated: string | null;
    cat: string;
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

  // const agent = useAgent({
  //   agent: "studybuddyagent",
  //   name: "mlem",
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-bold">Study Buddy Agent</h1>

        <ChatInterface />
      </div>
    </main>
  );
}
