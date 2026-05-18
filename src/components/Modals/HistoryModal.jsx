import { useState } from 'react';
import { X, CalendarDays, CheckCircle2, Circle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import './Modal.css';

export default function HistoryModal({ history, onClose }) {
  const [selectedDate, setSelectedDate] = useState('');

  const historyEntry = history.find(h => h.date === selectedDate);

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <CalendarDays size={20} className="icon-cyan" />
            <h2>Past Checklists</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="history-search">
            <label htmlFor="history-date">Select a Date</label>
            <input 
              type="date" 
              id="history-date"
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="history-results">
            {!selectedDate ? (
              <div className="modal-empty">
                <p>Pick a date above to view your completed tasks.</p>
              </div>
            ) : !historyEntry ? (
              <div className="modal-empty">
                <p>No checklist history found for {format(parseISO(selectedDate), 'MMM d, yyyy')}.</p>
              </div>
            ) : (
              <div className="history-task-list">
                <div className="history-stats">
                  <span>{historyEntry.completed} / {historyEntry.total} tasks completed</span>
                </div>
                {historyEntry.tasks && historyEntry.tasks.length > 0 ? (
                  <ul className="read-only-tasks">
                    {historyEntry.tasks.map(task => (
                      <li key={task.id} className={`ro-task-item ${task.done ? 'done' : ''}`}>
                        {task.done ? <CheckCircle2 size={16} className="icon-green" /> : <Circle size={16} className="icon-dim" />}
                        <span className="ro-task-text">{task.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="modal-empty-sub">No tasks recorded details for this day. (Tasks were not saved in older versions).</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
