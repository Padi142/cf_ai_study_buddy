# Study Buddy 🤖

This is a [web based](https://cf-ai-study-buddy-dnl.pages.dev/) LLM chat app designed to help students manage their time while studying!

## TLDR

The app is a NextJS based web application that allows the users to interact with an llm using a simple chat interface. The user can use the built in calendar to schedule events like exams and lectures. Then you can ask the Study Buddy to help you organize your study time. Be it scheduling study sessions, setting reminders, or making changes to the calendar. The LLM has access to a set of tools that allow it to read and write to the calendar.

## Tech stack

- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [Turso](https://turso.tech)
- [shadcn/ui](https://ui.shadcn.com)

## Cloudflare Products Used

- [Cloudflare Pages](https://pages.cloudflare.com) - Hosting the Next.js application.
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless functions to run the agent logic.
- [AI Gateway](https://developers.cloudflare.com/ai-gateway) - Proxying and managing LLM API requests.

## How to run locally

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Padi142/cf_ai_study_buddy.git
    cd cf_ai_study_buddy
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables as specified in `.env.example`. Mainly the DEEPSEEK_API_KEY.

   also do

   ```bash
    cd workers/agent
    wrangler secret put DEEPSEEK_API_KEY
   ```

4. Run the app and agent in separate terminals:

   ```bash
   pnpm dev
   ```

   ```bash
   pnpm run dev:agent
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Deployment

The app is deployed on Cloudflare Pages and the agent runs on Cloudflare Workers. The agent code is located in the `worker/` directory. You can deploy the worker using the Cloudflare CLI (`wrangler`).

Deployed instance is available at: https://cf-ai-study-buddy-dnl.pages.dev/

## Frontend

In order to not reinvent the wheel, I've decided to use the amazing [Vercel AI SDK](https://sdk.vercel.ai/docs). The library provides really good and easy to use components for building both backend and frontend parts of an AI app. In the frontend, I am using the `useAgent` and `useAgentChat` hooks to manage the chat interface and messages. The SDK also makes it easy to a streaming response using another library called `streamdown`, which allows rendering markdown content as it streams in from the LLM. The (Conversation)[https://ai-sdk.dev/elements/components/conversation] and (Message)[https://ai-sdk.dev/elements/components/message] components from the AI-elements collection are used to render the chat interface.

### Gradient

The background mesh radial gradient was carefully crafted using (MagicPattern)[https://www.magicpattern.design/tools/mesh-gradients].

### Agent and Tools

The agent is built using both the Cloudflare Agents and Vercel AI SDK libraries. The agent is defined in the `workers/agent/index.ts` file. The agent uses a set of tools to interact with the user's calendar. The agent has a set of tools and is designed to handle various user requests related to scheduling study sessions and managing calendar events.

## Possible improvements

There are many possible improvements that can be made to this app. Here are a few ideas:

- Real calendar integration (Google Calendar, ...)
- User authentication
- Quick message templates for common requests

While I wanted to add these features in this small demo, I have decided to keep it simple and focus on the core functionality.
