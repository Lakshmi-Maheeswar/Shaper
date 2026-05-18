import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import GoalCard from './GoalCard';
import './GoalList.css';

export default function GoalList({ goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addGoal = () => {
    const title = newGoal.trim();
    if (!title) return;
    setGoals([
      ...goals,
      { id: crypto.randomUUID(), title, steps: [] },
    ]);
    setNewGoal('');
    setIsAdding(false);
  };

  const removeGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const updateGoal = (updatedGoal) => {
    setGoals(goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addGoal();
    if (e.key === 'Escape') { setIsAdding(false); setNewGoal(''); }
  };

  return (
    <section className="goal-section fade-in" id="goals-section">
      <div className="section-header">
        <Target size={22} className="icon" />
        <h2>My Goals</h2>
      </div>

      <div className="goal-grid">
        {goals.filter((g) => !g.isCompleted).map((goal, i) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            index={i}
            onRemove={() => removeGoal(goal.id)}
            onUpdate={updateGoal}
          />
        ))}

        {/* Add Goal Card */}
        {isAdding ? (
          <div className="goal-add-card glass-card fade-in">
            <input
              type="text"
              className="goal-input"
              placeholder="e.g. Get a Job, Learn Trading..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="goal-add-actions">
              <button className="btn-confirm" onClick={addGoal}>Add</button>
              <button className="btn-cancel" onClick={() => { setIsAdding(false); setNewGoal(''); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="goal-add-btn glass-card" onClick={() => setIsAdding(true)} id="add-goal-btn">
            <Plus size={28} strokeWidth={1.5} />
            <span>Add Goal</span>
          </button>
        )}
      </div>
    </section>
  );
}
