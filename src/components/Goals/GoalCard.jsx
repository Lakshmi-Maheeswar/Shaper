import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Sparkles, CheckCircle } from 'lucide-react';
import GoalDetail from './GoalDetail';
import './GoalCard.css';

export default function GoalCard({ goal, index, onRemove, onUpdate }) {
  const [expanded, setExpanded] = useState(false);

  const completedSteps = goal.steps.filter((s) => s.done).length;
  const totalSteps = goal.steps.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const accentColors = [
    { gradient: 'linear-gradient(135deg, #a855f7, #6366f1)', glow: 'rgba(168, 85, 247, 0.25)' },
    { gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)', glow: 'rgba(34, 211, 238, 0.25)' },
    { gradient: 'linear-gradient(135deg, #34d399, #06b6d4)', glow: 'rgba(52, 211, 153, 0.25)' },
    { gradient: 'linear-gradient(135deg, #f97316, #eab308)', glow: 'rgba(249, 115, 22, 0.25)' },
    { gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236, 72, 153, 0.25)' },
    { gradient: 'linear-gradient(135deg, #14b8a6, #a3e635)', glow: 'rgba(20, 184, 166, 0.25)' },
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className={`goal-card glass-card fade-in ${expanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${index * 0.07}s`, '--card-glow': accent.glow }}
    >
      {/* Top accent bar */}
      <div className="goal-card-accent" style={{ background: accent.gradient }} />

      <div className="goal-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="goal-card-title-row">
          <Sparkles size={16} style={{ color: '#a855f7', flexShrink: 0 }} />
          <h3 className="goal-card-title">{goal.title}</h3>
        </div>
        <div className="goal-card-actions">
          <button
            className="icon-btn icon-btn-success"
            onClick={(e) => { e.stopPropagation(); onUpdate({ ...goal, isCompleted: true }); }}
            title="Mark as Completed"
          >
            <CheckCircle size={15} />
          </button>
          <button
            className="icon-btn icon-btn-danger"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Remove goal"
          >
            <Trash2 size={15} />
          </button>
          <button className="icon-btn" title={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {totalSteps > 0 && (
        <div className="goal-progress-wrapper">
          <div className="goal-progress-bar">
            <div
              className="goal-progress-fill"
              style={{ width: `${progress}%`, background: accent.gradient }}
            />
          </div>
          <span className="goal-progress-label">
            {completedSteps}/{totalSteps} steps
          </span>
        </div>
      )}

      {/* Expandable detail */}
      {expanded && (
        <div className="goal-detail-wrapper fade-in">
          <GoalDetail goal={goal} onUpdate={onUpdate} accentGradient={accent.gradient} />
        </div>
      )}
    </div>
  );
}
