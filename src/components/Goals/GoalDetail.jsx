import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Circle, CheckCircle2 } from 'lucide-react';
import './GoalDetail.css';

export default function GoalDetail({ goal, onUpdate, accentGradient }) {
  const [newStep, setNewStep] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addStep = () => {
    const text = newStep.trim();
    if (!text) return;
    const updated = {
      ...goal,
      steps: [...goal.steps, { id: crypto.randomUUID(), text, done: false }],
    };
    onUpdate(updated);
    setNewStep('');
  };

  const removeStep = (stepId) => {
    onUpdate({ ...goal, steps: goal.steps.filter((s) => s.id !== stepId) });
  };

  const toggleStep = (stepId) => {
    onUpdate({
      ...goal,
      steps: goal.steps.map((s) =>
        s.id === stepId ? { ...s, done: !s.done } : s
      ),
    });
  };

  const startEdit = (step) => {
    setEditingId(step.id);
    setEditText(step.text);
  };

  const saveEdit = () => {
    const text = editText.trim();
    if (!text) return;
    onUpdate({
      ...goal,
      steps: goal.steps.map((s) =>
        s.id === editingId ? { ...s, text } : s
      ),
    });
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="goal-detail">
      <p className="goal-detail-label">Action Steps</p>

      <ul className="step-list">
        {goal.steps.map((step) => (
          <li key={step.id} className={`step-item ${step.done ? 'done' : ''}`}>
            {editingId === step.id ? (
              <div className="step-edit-row">
                <input
                  type="text"
                  className="step-edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                />
                <button className="icon-btn icon-btn-success" onClick={saveEdit}><Check size={14} /></button>
                <button className="icon-btn" onClick={cancelEdit}><X size={14} /></button>
              </div>
            ) : (
              <div className="step-content-row">
                <button className="step-check-btn" onClick={() => toggleStep(step.id)}>
                  {step.done
                    ? <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                    : <Circle size={18} style={{ color: 'var(--text-dim)' }} />}
                </button>
                <span className="step-text">{step.text}</span>
                <div className="step-actions">
                  <button className="icon-btn-sm" onClick={() => startEdit(step)} title="Edit"><Pencil size={13} /></button>
                  <button className="icon-btn-sm icon-btn-danger" onClick={() => removeStep(step.id)} title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Add step input */}
      <div className="step-add-row">
        <input
          type="text"
          className="step-add-input"
          placeholder="Add a step..."
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addStep()}
        />
        <button className="step-add-btn" onClick={addStep} style={{ background: accentGradient }}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
