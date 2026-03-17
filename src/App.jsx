import React, { useState, useCallback } from 'react';
import {
  addDays, addWeeks, addMonths,
  subDays, subWeeks, subMonths,
  format,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday as _isToday, isSameDay,
} from 'date-fns';
import { useEvents } from './hooks/useEvents';
import CalendarHeader from './components/CalendarHeader';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import './App.css';

// ---- Mini Calendar in sidebar ----
function MiniCalendar({ currentDate, onDateSelect }) {
  const [miniDate, setMiniDate] = useState(() => new Date());
  const monthStart = startOfMonth(miniDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button className="mini-nav" onClick={() => setMiniDate((d) => subMonths(d, 1))}>&#8249;</button>
        <span className="mini-cal-month">{format(miniDate, 'MMM yyyy')}</span>
        <button className="mini-nav" onClick={() => setMiniDate((d) => addMonths(d, 1))}>&#8250;</button>
      </div>
      <div className="mini-cal-days">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="mini-day-hdr">{d}</div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={[
              'mini-day',
              !isSameMonth(day, miniDate) ? 'mini-outside' : '',
              _isToday(day) ? 'mini-today' : '',
              isSameDay(day, currentDate) ? 'mini-selected' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onDateSelect(day)}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState(null);

  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  const handlePrev = useCallback(() => {
    setCurrentDate((d) => {
      if (view === 'day') return subDays(d, 1);
      if (view === 'week') return subWeeks(d, 1);
      return subMonths(d, 1);
    });
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate((d) => {
      if (view === 'day') return addDays(d, 1);
      if (view === 'week') return addWeeks(d, 1);
      return addMonths(d, 1);
    });
  }, [view]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleDayClick = useCallback((day) => {
    setModal({
      mode: 'add',
      defaults: { date: format(day, 'yyyy-MM-dd') },
    });
  }, []);

  const handleSlotClick = useCallback(({ date, startTime, endTime }) => {
    setModal({ mode: 'add', defaults: { date, startTime, endTime } });
  }, []);

  const handleEventClick = useCallback((evt) => {
    setModal({ mode: 'edit', event: evt });
  }, []);

  const handleSave = useCallback((formData) => {
    if (modal?.mode === 'edit' && modal.event) {
      updateEvent(modal.event.id, formData);
    } else {
      addEvent(formData);
    }
    setModal(null);
  }, [modal, addEvent, updateEvent]);

  const handleDelete = useCallback((id) => {
    deleteEvent(id);
    setModal(null);
  }, [deleteEvent]);

  const handleAddNew = () => {
    setModal({
      mode: 'add',
      defaults: { date: format(currentDate, 'yyyy-MM-dd') },
    });
  };

  return (
    <div className="app-root">
      <div className="app-sidebar">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#007AFF"/>
            <rect x="7" y="7" width="6" height="6" rx="1.5" fill="white"/>
            <rect x="15" y="7" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.6"/>
            <rect x="7" y="15" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.6"/>
            <rect x="15" y="15" width="6" height="6" rx="1.5" fill="white"/>
          </svg>
          <span className="sidebar-logo-text">Schedule</span>
        </div>
        <button className="btn-new-event" onClick={handleAddNew}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          New Event
        </button>
        <div className="sidebar-mini-cal">
          <MiniCalendar
            currentDate={currentDate}
            onDateSelect={(d) => { setCurrentDate(d); setView('day'); }}
          />
        </div>
        <div className="sidebar-legend">
          <div className="legend-title">Calendars</div>
          {[
            { label: 'Personal', color: '#007AFF' },
            { label: 'Work', color: '#34C759' },
            { label: 'Important', color: '#FF3B30' },
          ].map(({ label, color }) => (
            <div key={label} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="app-main">
        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        <div className="calendar-body">
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onSlotClick={handleSlotClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              onSlotClick={handleSlotClick}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>

      {modal && (
        <EventModal
          event={modal.mode === 'edit' ? modal.event : null}
          defaultDate={modal.defaults?.date}
          defaultStartTime={modal.defaults?.startTime}
          defaultEndTime={modal.defaults?.endTime}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
