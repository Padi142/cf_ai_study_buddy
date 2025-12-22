import {
    Agent,
    routeAgentRequest,
    type AgentNamespace,
} from "agents";

import { AIChatAgent } from "agents/ai-chat-agent";
import { type UIMessage, type StreamTextOnFinishCallback, type ToolSet, streamText, convertToModelMessages } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

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
        messages: []
    };

    einfra = createOpenAICompatible({
        name: "einfra",
        baseURL: "https://chat.ai.e-infra.cz/api/",
        apiKey: this.env.EINFRA_API_KEY,
    });

    async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
        const result = streamText({
            model: this.einfra(modelId),
            system: "Always reply with the number 43",
            messages: convertToModelMessages(this.messages),
            onFinish,
        });

        return result.toUIMessageStreamResponse();
    }

}
