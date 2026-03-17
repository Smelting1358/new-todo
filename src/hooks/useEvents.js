import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'schedule_events';

const generateId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const defaultEvents = [
  {
    id: generateId(),
    title: 'Team Standup',
    date: new Date().toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '09:30',
    color: '#007AFF',
    notes: 'Daily team sync',
  },
  {
    id: generateId(),
    title: 'Lunch Break',
    date: new Date().toISOString().slice(0, 10),
    startTime: '12:00',
    endTime: '13:00',
    color: '#34C759',
    notes: '',
  },
];

export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return defaultEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  const addEvent = useCallback((eventData) => {
    const newEvent = { ...eventData, id: generateId() };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, eventData) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...eventData, id } : e))
    );
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getEventsForDate = useCallback(
    (dateStr) => events.filter((e) => e.date === dateStr),
    [events]
  );

  const getEventsForDateRange = useCallback(
    (startStr, endStr) =>
      events.filter((e) => e.date >= startStr && e.date <= endStr),
    [events]
  );

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForDateRange,
  };
}
