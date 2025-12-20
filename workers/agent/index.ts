import {
    Agent,
    routeAgentRequest,
    type AgentNamespace,
} from "agents";

interface Env {
    studybuddyagent: AgentNamespace<StudyBuddyAgent>;
}

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
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export class StudyBuddyAgent extends Agent<Env, MyState> {
    initialState = {
        counter: 0,
        lastUpdated: null,
    };

    async onRequest(request: Request) {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method === "POST") {
            await this.incrementCounter();
            return new Response(JSON.stringify(this.state), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }
        return new Response(JSON.stringify(this.state), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }

    async incrementCounter() {
        this.setState({
            counter: this.state.counter + 1,
            lastUpdated: new Date(),
        });
    }
}
