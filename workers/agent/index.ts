import {
    Agent,
    routeAgentRequest,
    type AgentNamespace,
} from "agents";

import { AIChatAgent } from "agents/ai-chat-agent";
import { type UIMessage, type StreamTextOnFinishCallback, streamText, convertToModelMessages, stepCountIs } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { CalendarEntry } from "~/lib/types/calendar";
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";


interface Env {
    studybuddyagent: AgentNamespace<StudyBuddyAgent>;
}


const modelId = 'gpt-oss-120b';

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Add CORS headers for cross-origin requests from the Next.js app
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        const response = await routeAgentRequest(request, env);

        if (response) {
            // Clone response to add CORS headers
            const newResponse = new Response(response.body, response);
            Object.entries(corsHeaders).forEach(([key, value]) => {
                newResponse.headers.set(key, value);
            });
            return newResponse;
        }

        return Response.json(
            { msg: "no agent here" },
            { status: 404, headers: corsHeaders }
        );
    },
};

interface MyState {
    counter: number;
    lastUpdated: Date | null;
    messages: UIMessage[];
    calendarEntries: CalendarEntry[]
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export class StudyBuddyAgent extends AIChatAgent<Env, MyState> {
    initialState = {
        counter: 0,
        lastUpdated: null,
        cat: "",
        messages: [],
        calendarEntries: [],
    };

    einfra = createOpenAICompatible({
        name: "einfra",
        baseURL: "https://chat.ai.e-infra.cz/api/",
        apiKey: this.env.EINFRA_API_KEY,
    });

    async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
        const result = streamText({
            model: this.einfra(modelId),
            system: "You are a helpful calendar assistant. Use the tools you have to assist the user.",
            messages: convertToModelMessages(this.messages),
            tools: { getUsersCalendar: this.getUsersCalendar },
            stopWhen: stepCountIs(10),
            onFinish,
        });

        return result.toUIMessageStreamResponse();
    }

    async onRequest(request: Request) {
        const url = new URL(request.url);

        // Handle your custom endpoints
        if (url.pathname.includes("/hello")) {
            return new Response("Hello from Agent!");
        }

        // Sync calendar entries
        if (url.pathname.includes("/calendar") && request.method === "POST") {
            try {
                const body = await request.json() as { entries: CalendarEntry[] };
                this.setState({ ...this.state, calendarEntries: body.entries });
                return Response.json(
                    { success: true, count: body.entries.length },
                    { headers: corsHeaders }
                );
            } catch (error) {
                return Response.json(
                    { success: false, error: "Invalid request body" },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // Get calendar entries
        if (url.pathname.includes("/calendar") && request.method === "GET") {
            return Response.json(
                { entries: this.state.calendarEntries },
                { headers: corsHeaders }
            );
        }

        // Fall back to parent class for AIChatAgent endpoints
        return super.onRequest(request);
    }

    getUsersCalendar = tool({
        description: "Get all entries the user has in their calendar",
        inputSchema: z.object({}),
        execute: async ({ }) => {
            console.log('Running getUsersCalendar tool')
            const entries = this.state.calendarEntries;
            return entries;
        }
    });

}


