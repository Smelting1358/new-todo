import React from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday, isSameDay,
} from 'date-fns';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({ currentDate, events, onDayClick, onEventClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <div className="month-view">
      <div className="month-day-headers">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="month-day-header">{d}</div>
        ))}
      </div>
      <div className="month-grid">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const todayClass = isToday(day) ? 'today' : '';
          const outsideClass = !isCurrentMonth ? 'outside-month' : '';

          return (
            <div
              key={day.toISOString()}
              className={`month-cell ${todayClass} ${outsideClass}`}
              onClick={() => onDayClick(day)}
            >
              <div className="month-cell-header">
                <span className={`day-number ${todayClass}`}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="month-cell-events">
                {dayEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="month-event-chip"
                    style={{ backgroundColor: evt.color || '#007AFF' }}
                    onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                    title={`${evt.title} ${evt.startTime}–${evt.endTime}`}
                  >
                    <span className="event-chip-time">{evt.startTime}</span>
                    <span className="event-chip-title">{evt.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="month-event-more">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
