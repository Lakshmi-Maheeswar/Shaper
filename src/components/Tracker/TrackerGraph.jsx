import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { subDays, subMonths, subYears, parseISO, isAfter, format } from 'date-fns';
import { BarChart3 } from 'lucide-react';
import './TrackerGraph.css';

const RANGES = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '3M', value: '3months' },
  { label: '6M', value: '6months' },
  { label: '1Y', value: '1year' },
  { label: '3Y', value: '3years' },
  { label: '5Y', value: '5years' },
  { label: 'Max', value: 'max' },
];

function getStartDate(range) {
  const now = new Date();
  switch (range) {
    case 'day': return subDays(now, 1);
    case 'week': return subDays(now, 7);
    case 'month': return subMonths(now, 1);
    case '3months': return subMonths(now, 3);
    case '6months': return subMonths(now, 6);
    case '1year': return subYears(now, 1);
    case '3years': return subYears(now, 3);
    case '5years': return subYears(now, 5);
    case 'max': return new Date(2000, 0, 1);
    default: return subMonths(now, 1);
  }
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tracker-tooltip">
      <p className="tooltip-date">{label}</p>
      <p className="tooltip-value">
        <span className="tooltip-num">{payload[0].value}</span> tasks completed
      </p>
    </div>
  );
}

export default function TrackerGraph({ history }) {
  const [range, setRange] = useState('month');

  const filteredData = useMemo(() => {
    const startDate = getStartDate(range);
    return history
      .filter((entry) => {
        try {
          return isAfter(parseISO(entry.date), startDate);
        } catch {
          return false;
        }
      })
      .map((entry) => ({
        date: format(parseISO(entry.date), 'MMM d'),
        completed: entry.completed,
        total: entry.total,
      }));
  }, [history, range]);

  const totalCompleted = filteredData.reduce((s, d) => s + d.completed, 0);
  const totalTasks = filteredData.reduce((s, d) => s + d.total, 0);
  const avgRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="tracker-section fade-in" id="tracker-section">
      <div className="section-header">
        <BarChart3 size={22} className="icon" />
        <h2>Tracker</h2>
      </div>

      <div className="tracker-card glass-card">
        {/* Stats bar */}
        <div className="tracker-stats-bar">
          <div className="tracker-stat">
            <span className="stat-value gradient-text">{totalCompleted}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="tracker-stat">
            <span className="stat-value">{filteredData.length}</span>
            <span className="stat-label">Days Tracked</span>
          </div>
          <div className="tracker-stat">
            <span className="stat-value">{avgRate}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>

        {/* Range selector */}
        <div className="tracker-range-bar">
          {RANGES.map((r) => (
            <button
              key={r.value}
              className={`range-btn ${range === r.value ? 'active' : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="tracker-chart-wrapper">
          {filteredData.length === 0 ? (
            <div className="tracker-empty">
              <p>No data yet for this range. Complete daily checklists to see your progress!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#colorCompleted)"
                  dot={{ fill: '#a855f7', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#c084fc', stroke: '#a855f7', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
