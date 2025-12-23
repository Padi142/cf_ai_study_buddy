"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface CalendarRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const CalendarRefreshContext = createContext<CalendarRefreshContextType | null>(
  null,
);

export function CalendarRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <CalendarRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </CalendarRefreshContext.Provider>
  );
}

export function useCalendarRefresh() {
  const context = useContext(CalendarRefreshContext);
  if (!context) {
    throw new Error(
      "useCalendarRefresh must be used within a CalendarRefreshProvider",
    );
  }
  return context;
}
