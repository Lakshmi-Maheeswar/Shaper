import { X, Archive, RotateCcw, Trash2 } from 'lucide-react';
import './Modal.css';

export default function CompletedGoalsModal({ goals, setGoals, onClose }) {
  const completedGoals = goals.filter((g) => g.isCompleted);

  const uncompleteGoal = (id) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, isCompleted: false } : g)));
  };

  const removeGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Archive size={20} className="icon-purple" />
            <h2>Completed Goals</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {completedGoals.length === 0 ? (
            <div className="modal-empty">
              <p>No completed goals yet. Keep grinding!</p>
            </div>
          ) : (
            <div className="completed-goals-list">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="completed-goal-item">
                  <div className="completed-goal-info">
                    <h3>{goal.title}</h3>
                    <p>{goal.steps.filter(s => s.done).length} / {goal.steps.length} steps completed</p>
                  </div>
                  <div className="completed-goal-actions">
                    <button 
                      className="icon-btn" 
                      onClick={() => uncompleteGoal(goal.id)}
                      title="Move back to active goals"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button 
                      className="icon-btn icon-btn-danger" 
                      onClick={() => removeGoal(goal.id)}
                      title="Delete permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
