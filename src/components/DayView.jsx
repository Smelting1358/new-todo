import React, { useRef, useEffect } from 'react';
import { format, isToday } from 'date-fns';

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

export default function DayView({ currentDate, events, onSlotClick, onEventClick }) {
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayEvents = events.filter((e) => e.date === dateStr);
  const scrollRef = useRef(null);
  const CELL_HEIGHT = 64;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * CELL_HEIGHT - 32;
    }
  }, []);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showNowLine = isToday(currentDate);

  return (
    <div className="day-view">
      <div className="day-view-header">
        <div className={`day-view-date-badge ${isToday(currentDate) ? 'today' : ''}`}>
          <span className="day-view-weekday">{format(currentDate, 'EEEE')}</span>
          <span className="day-view-daynum">{format(currentDate, 'd')}</span>
        </div>
      </div>
      <div className="day-scroll-area" ref={scrollRef}>
        <div className="day-grid" style={{ height: `${CELL_HEIGHT * 24}px` }}>
          {/* Hour labels */}
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
          {/* Now line */}
          {showNowLine && (
            <div
              className="now-line"
              style={{ top: `${(nowMinutes / 60) * CELL_HEIGHT}px` }}
            >
              <div className="now-dot" />
            </div>
          )}
          {/* Events column */}
          <div
            className="day-events-col"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top + e.currentTarget.closest('.day-scroll-area').scrollTop;
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
              const height = Math.max(((endMin - startMin) / 60) * CELL_HEIGHT, 24);
              return (
                <div
                  key={evt.id}
                  className="day-event"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: evt.color || '#007AFF',
                  }}
                  onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                >
                  <div className="day-event-title">{evt.title}</div>
                  <div className="day-event-time">{evt.startTime}–{evt.endTime}</div>
                  {evt.notes && <div className="day-event-notes">{evt.notes}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
