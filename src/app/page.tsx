"use client";

import { ChatInterface } from "./agent";
import { CalendarEvents } from "~/components/calendar/calendar-events";
import { CalendarRefreshProvider } from "~/lib/calendar-context";

export default function HomePage() {
  return (
    <CalendarRefreshProvider>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <h1 className="text-4xl font-bold">Study Buddy Agent</h1>

          <CalendarEvents />

          <ChatInterface />
        </div>
      </main>
    </CalendarRefreshProvider>
  );
}
