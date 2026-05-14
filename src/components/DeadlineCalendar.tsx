import { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { Opportunity } from '../types';

interface Props {
  opportunities: Opportunity[];
  onSelect: (opp: Opportunity) => void;
}

export const DeadlineCalendar = ({ opportunities, onSelect }: Props) => {
  const deadlines = useMemo(() => {
    const now = Date.now();
    const ninetyDays = now + 90 * 86400000;
    return opportunities
      .filter((o) => o.deadline && new Date(o.deadline).getTime() > now && new Date(o.deadline).getTime() < ninetyDays)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .map((o) => {
        const deadline = new Date(o.deadline!);
        const daysLeft = Math.ceil((deadline.getTime() - now) / 86400000);
        return { ...o, deadline, daysLeft };
      });
  }, [opportunities]);

  if (deadlines.length === 0) return null;

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return '#dc2626';
    if (days <= 14) return '#d97706';
    if (days <= 30) return '#f5b419';
    return '#16a34a';
  };

  const getUrgencyBg = (days: number) => {
    if (days <= 7) return 'rgba(220, 38, 38, 0.08)';
    if (days <= 14) return 'rgba(217, 119, 6, 0.08)';
    if (days <= 30) return 'rgba(245, 180, 25, 0.08)';
    return 'rgba(22, 163, 74, 0.08)';
  };

  return (
    <div className="deadline-calendar">
      <div className="deadline-calendar__header">
        <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
        <span>Upcoming Deadlines</span>
        <span className="deadline-calendar__count">{deadlines.length}</span>
      </div>
      <div className="deadline-calendar__track">
        {deadlines.map((d) => (
          <button
            key={d.id}
            className="deadline-calendar__item"
            style={{ borderLeftColor: getUrgencyColor(d.daysLeft), backgroundColor: getUrgencyBg(d.daysLeft) }}
            onClick={() => onSelect(d)}
          >
            <div className="deadline-calendar__item-days" style={{ color: getUrgencyColor(d.daysLeft) }}>
              <Clock size={10} />
              {d.daysLeft}d
            </div>
            <div className="deadline-calendar__item-name">{d.name.length > 30 ? d.name.slice(0, 30) + '…' : d.name}</div>
            <div className="deadline-calendar__item-date">
              {d.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
