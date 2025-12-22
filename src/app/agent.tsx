"use client";

// Example of using useAgentChat in a React component
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { useState } from "react";

// In production, this should be your deployed worker URL
const AGENT_WORKER_HOST =
  process.env.NEXT_PUBLIC_AGENT_URL?.replace(/^https?:\/\//, "") ??
  "localhost:8787";

// Helper to extract text content from UIMessage parts
function getMessageContent(message: {
  parts?: Array<{ type: string; text?: string }>;
}): string {
  if (!message.parts || !Array.isArray(message.parts)) {
    return "";
  }
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

export function ChatInterface() {
  const [input, setInput] = useState("");

  // Connect to the chat agent
  const agentConnection = useAgent({
    agent: "studybuddyagent",
    name: "mlem",
    host: AGENT_WORKER_HOST,
  });

  // Use the useAgentChat hook with the agent connection
  const { messages, sendMessage, status, error, clearHistory } = useAgentChat({
    agent: agentConnection,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage({ text: message });
  };

  console.log("Agent state:", messages);

  // Ensure messages is an array (might be undefined or agent state object initially)
  const messageList = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[600px] bg-gray-900 rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageList.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            No messages yet. Start a conversation!
          </div>
        )}
        {messageList.map((message, i) => (
          <div
            key={message.id ?? i}
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-600 ml-auto max-w-[80%]"
                : "bg-gray-700 mr-auto max-w-[80%]"
            }`}
          >
            <span className="mr-2">{message.role === "user" ? "👤" : "🤖"}</span>
            {getMessageContent(message)}
          </div>
        ))}

        {isLoading && (
          <div className="text-gray-400 italic">AI is typing...</div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/20 p-3 rounded-lg">
            Error: {error.message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-700">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Send
        </button>
        <button
          type="button"
          onClick={clearHistory}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Clear
        </button>
      </form>
    </div>
  );
}
