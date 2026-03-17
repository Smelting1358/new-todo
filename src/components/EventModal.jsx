import React, { useState, useEffect, useRef } from 'react';

const EVENT_COLORS = [
  { label: 'Blue',   value: '#007AFF' },
  { label: 'Green',  value: '#34C759' },
  { label: 'Red',    value: '#FF3B30' },
  { label: 'Orange', value: '#FF9500' },
  { label: 'Purple', value: '#AF52DE' },
];

const emptyForm = {
  title: '',
  date: '',
  startTime: '09:00',
  endTime: '10:00',
  color: '#007AFF',
  notes: '',
};

export default function EventModal({ event, defaultDate, defaultStartTime, defaultEndTime, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const titleRef = useRef(null);

  useEffect(() => {
    if (event) {
      setForm({ ...emptyForm, ...event });
    } else {
      setForm({
        ...emptyForm,
        date: defaultDate || new Date().toISOString().slice(0, 10),
        startTime: defaultStartTime || '09:00',
        endTime: defaultEndTime || '10:00',
      });
    }
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [event, defaultDate, defaultStartTime, defaultEndTime]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { titleRef.current?.focus(); return; }
    if (!form.date) return;
    onSave(form);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} onKeyDown={handleKeyDown}>
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{event ? 'Edit Event' : 'New Event'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              ref={titleRef}
              className="form-input"
              type="text"
              placeholder="Add a title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start</label>
              <input
                className="form-input"
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End</label>
              <input
                className="form-input"
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-swatch ${form.color === c.value ? 'selected' : ''}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => handleChange('color', c.value)}
                  aria-label={c.label}
                  title={c.label}
                >
                  {form.color === c.value && (
                    <svg className="check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Add notes..."
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            {event && (
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(event.id)}
              >
                Delete
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-save">
                {event ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
