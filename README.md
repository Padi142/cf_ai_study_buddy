# Study Buddy 🤖

This is a [web based](https://cf-ai-study-buddy-dnl.pages.dev/) LLM chat app designed to help students manage their time while studying!

## How does it work?

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
   Create a `.env` file in the root directory and add the necessary environment variables as specified in `.env.example`. Mainly the DEEPSEEK_API_KEY. 4. Run the app and agent in separate terminals:

   ```bash
   pnpm dev
   ```

   ```bash
   pnpm run dev:agent
   ```

4. Open your browser and navigate to `http://localhost:3000` to access the application.

## Deployment

The app is deployed on Cloudflare Pages and the agent runs on Cloudflare Workers. The agent code is located in the `worker/` directory. You can deploy the worker using the Cloudflare CLI (`wrangler`).

Deployed instance is available at: https://cf-ai-study-buddy-dnl.pages.dev/
