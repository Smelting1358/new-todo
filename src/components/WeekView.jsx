import React, { useRef, useEffect } from 'react';
import {
  startOfWeek, endOfWeek, eachDayOfInterval, format, isToday,
} from 'date-fns';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function formatHour(h) {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

export default function WeekView({ currentDate, events, onSlotClick, onEventClick }) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * 60 - 30; // scroll to 7am
    }
  }, []);

  const getEventsForDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return events.filter((e) => e.date === dateStr);
  };

  const CELL_HEIGHT = 60; // px per hour

  return (
    <div className="week-view">
      <div className="week-header-row">
        <div className="time-gutter" />
        {days.map((day) => (
          <div key={day.toISOString()} className={`week-day-header ${isToday(day) ? 'today' : ''}`}>
            <span className="week-day-name">{format(day, 'EEE')}</span>
            <span className={`week-day-num ${isToday(day) ? 'today-badge' : ''}`}>
              {format(day, 'd')}
            </span>
          </div>
        ))}
      </div>
      <div className="week-scroll-area" ref={scrollRef}>
        <div className="week-grid" style={{ height: `${CELL_HEIGHT * 24}px` }}>
          {/* Hour lines + labels */}
          <div className="time-gutter-col">
            {HOURS.map((h) => (
              <div key={h} className="time-label" style={{ top: `${h * CELL_HEIGHT}px` }}>
                {h > 0 ? formatHour(h) : ''}
              </div>
            ))}
          </div>
          {/* Hour lines */}
          <div className="hour-lines">
            {HOURS.map((h) => (
              <div key={h} className="hour-line" style={{ top: `${h * CELL_HEIGHT}px` }} />
            ))}
          </div>
          {/* Day columns */}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const dateStr = format(day, 'yyyy-MM-dd');
            return (
              <div
                key={day.toISOString()}
                className={`week-day-col ${isToday(day) ? 'today-col' : ''}`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top + e.currentTarget.closest('.week-scroll-area').scrollTop;
                  const minutes = Math.floor(y / CELL_HEIGHT * 60 / 15) * 15;
                  const h = Math.floor(minutes / 60);
                  const m = minutes % 60;
                  const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                  const endH = h + 1 > 23 ? 23 : h + 1;
                  const endTime = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                  onSlotClick({ date: dateStr, startTime, endTime });
                }}
              >
                {dayEvents.map((evt) => {
                  const startMin = timeToMinutes(evt.startTime);
                  const endMin = timeToMinutes(evt.endTime) || startMin + 60;
                  const top = (startMin / 60) * CELL_HEIGHT;
                  const height = Math.max(((endMin - startMin) / 60) * CELL_HEIGHT, 20);
                  return (
                    <div
                      key={evt.id}
                      className="week-event"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: evt.color || '#007AFF',
                      }}
                      onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                    >
                      <div className="week-event-title">{evt.title}</div>
                      <div className="week-event-time">{evt.startTime}–{evt.endTime}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
