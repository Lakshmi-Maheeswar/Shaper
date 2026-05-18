import { Circle, CheckCircle2, X } from 'lucide-react';
import './ChecklistItem.css';

export default function ChecklistItem({ task, onToggle, onRemove }) {
  return (
    <div className={`cl-item ${task.done ? 'cl-done' : ''}`}>
      <button className="cl-check" onClick={onToggle}>
        {task.done
          ? <CheckCircle2 size={20} />
          : <Circle size={20} />}
      </button>
      <span className="cl-text">{task.text}</span>
      <span className={`cl-badge ${task.done ? 'badge-done' : 'badge-pending'}`}>
        {task.done ? 'Done' : 'Not Done'}
      </span>
      <button className="cl-remove" onClick={onRemove} title="Remove task">
        <X size={14} />
      </button>
    </div>
  );
}
