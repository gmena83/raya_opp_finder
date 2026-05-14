import { CheckCircle2, Loader2, Circle, AlertTriangle } from 'lucide-react';
import type { ResearchTask, ResearchStatus } from '../types';

const toolColors: Record<string, string> = {
  Apify: '#1d4ed8',
  Perplexity: '#7c3aed',
  Serper: '#059669',
  Claude: '#d97706',
};

interface Props {
  status: ResearchStatus;
  progress: number;
  tasks: ResearchTask[];
  lastUpdated?: string;
}

export const ResearchProgress = ({ status, progress, tasks, lastUpdated }: Props) => {
  const completedCount = tasks.filter((t) => t.status === 'complete').length;

  return (
    <div className="research-progress">
      {/* Overall progress */}
      <div className="research-progress__header">
        <div className="research-progress__status">
          {status === 'complete' && <CheckCircle2 size={14} style={{ color: '#16a34a' }} />}
          {status === 'in_progress' && <Loader2 size={14} className="spin" style={{ color: 'var(--color-primary)' }} />}
          {status === 'not_started' && <Circle size={14} style={{ color: 'var(--color-ink-quaternary)' }} />}
          <span style={{ fontWeight: 600 }}>
            {status === 'complete' ? 'Research Complete' : status === 'in_progress' ? 'Research In Progress' : 'Research Not Started'}
          </span>
        </div>
        <span className="research-progress__count">{completedCount} of {tasks.length} tasks</span>
      </div>

      {/* Progress bar */}
      <div className="research-progress__bar-track">
        <div
          className="research-progress__bar-fill"
          style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#16a34a' : 'var(--color-primary)' }}
        />
      </div>

      {/* Task list */}
      <div className="research-progress__tasks">
        {tasks.map((task) => (
          <div key={task.id} className="research-progress__task">
            <div className="research-progress__task-icon">
              {task.status === 'complete' && <CheckCircle2 size={14} style={{ color: '#16a34a' }} />}
              {task.status === 'running' && <Loader2 size={14} className="spin" style={{ color: 'var(--color-primary)' }} />}
              {task.status === 'pending' && <Circle size={14} style={{ color: 'var(--color-ink-quaternary)' }} />}
              {task.status === 'error' && <AlertTriangle size={14} style={{ color: '#dc2626' }} />}
            </div>
            <div className="research-progress__task-body">
              <div className="research-progress__task-label">{task.label}</div>
              {task.result && <div className="research-progress__task-result">{task.result}</div>}
            </div>
            <span
              className="research-progress__tool-badge"
              style={{ color: toolColors[task.tool] || 'var(--color-ink-muted)', borderColor: toolColors[task.tool] || 'var(--color-surface-1)' }}
            >
              {task.tool}
            </span>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="research-progress__updated">
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};
