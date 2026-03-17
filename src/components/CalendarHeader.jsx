import React from 'react';
import { format } from 'date-fns';

const VIEW_LABELS = { day: 'Day', week: 'Week', month: 'Month' };

export default function CalendarHeader({ view, setView, currentDate, onPrev, onNext, onToday }) {
  const getTitle = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') return format(currentDate, 'MMM d, yyyy');
    return format(currentDate, 'EEEE, MMMM d, yyyy');
  };

  return (
    <header className="cal-header">
      <div className="cal-header-left">
        <button className="btn-today" onClick={onToday}>Today</button>
        <div className="nav-arrows">
          <button className="btn-nav" onClick={onPrev} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-nav" onClick={onNext} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <h1 className="cal-title">{getTitle()}</h1>
      </div>
      <div className="cal-header-right">
        <div className="view-switcher">
          {Object.entries(VIEW_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`btn-view ${view === key ? 'active' : ''}`}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
