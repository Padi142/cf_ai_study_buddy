"use client";

import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { useState } from "react";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "~/components/ai-elements/message";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { D } from "node_modules/agents/dist/index-B6XHf8p0";

// In production, this should be your deployed worker URL
const AGENT_WORKER_HOST =
  process.env.NEXT_PUBLIC_AGENT_URL?.replace(/^https?:\/\//, "") ??
  "localhost:8787";

export const AGENT_URL =
  process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:8787";

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

  // Ensure messages is an array (might be undefined or agent state object initially)
  const messageList = Array.isArray(messages) ? messages : [];

  return (
    <div className="mx-auto flex h-[600px] w-full max-w-2xl flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messageList.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No messages yet. Start a conversation!
          </div>
        )}
        {messageList.map((message, i) => {
          const content = getMessageContent(message);
          const from = message.role === "user" ? "user" : "assistant";

          return (
            <Message from={from} key={message.id ?? i}>
              <MessageContent>
                {from === "assistant" ? (
                  <div>
                    🤖
                    <MessageResponse>{content}</MessageResponse>
                  </div>
                ) : (
                  content
                )}
              </MessageContent>
              {from === "assistant" && <MessageActions></MessageActions>}
            </Message>
          );
        })}

        {isLoading && (
          <div className="text-gray-500 italic">AI is typing...</div>
        )}
        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-600">
            Error: {error.message}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-gray-200 p-4"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isLoading || !input}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </Button>
        <Button
          type="button"
          onClick={clearHistory}
          className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
        >
          Clear
        </Button>
      </form>
    </div>
  );
}
