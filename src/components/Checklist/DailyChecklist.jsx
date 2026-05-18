import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarDays, Plus, ListChecks } from 'lucide-react';
import ChecklistItem from './ChecklistItem';
import './DailyChecklist.css';

export default function DailyChecklist({ checklist, setChecklist, onDayClose }) {
  const [newTask, setNewTask] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  // Handle day change in an effect to avoid updating state during render
  useEffect(() => {
    if (checklist.date && checklist.date !== today) {
      onDayClose(checklist);
      setChecklist({ date: today, tasks: [] });
    } else if (!checklist.date) {
      setChecklist({ date: today, tasks: [] });
    }
  }, [today]); // eslint-disable-line react-hooks/exhaustive-deps

  // Don't render until the date is set to today
  if (checklist.date !== today) return null;

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setChecklist({
      ...checklist,
      tasks: [...checklist.tasks, { id: crypto.randomUUID(), text, done: false }],
    });
    setNewTask('');
  };

  const toggleTask = (taskId) => {
    setChecklist({
      ...checklist,
      tasks: checklist.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    });
  };

  const removeTask = (taskId) => {
    setChecklist({
      ...checklist,
      tasks: checklist.tasks.filter((t) => t.id !== taskId),
    });
  };

  const completedCount = checklist.tasks.filter((t) => t.done).length;
  const totalCount = checklist.tasks.length;

  return (
    <div className="checklist-section fade-in" id="checklist-section">
      <div className="section-header">
        <ListChecks size={22} className="icon" />
        <h2>Daily Checklist</h2>
      </div>

      <div className="checklist-card glass-card">
        {/* Date header */}
        <div className="checklist-date-bar">
          <div className="checklist-date">
            <CalendarDays size={16} />
            <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          {totalCount > 0 && (
            <div className="checklist-stats">
              <span className="stats-done">{completedCount}</span>
              <span className="stats-sep">/</span>
              <span className="stats-total">{totalCount}</span>
              <span className="stats-label">done</span>
            </div>
          )}
        </div>

        {/* Task list */}
        <div className="checklist-tasks">
          {checklist.tasks.length === 0 && (
            <div className="checklist-empty">
              <p>No tasks yet. Add something to accomplish today!</p>
            </div>
          )}
          {checklist.tasks.map((task) => (
            <ChecklistItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onRemove={() => removeTask(task.id)}
            />
          ))}
        </div>

        {/* Add task */}
        <div className="checklist-add-row">
          <input
            type="text"
            className="checklist-add-input"
            placeholder="What do you want to do today?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="checklist-add-btn" onClick={addTask}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
