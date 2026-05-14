import { useState, useEffect, useCallback } from 'react';
import { Activity, Search, ArrowRightLeft, CheckCircle2, PenLine, Send } from 'lucide-react';
import { getActivityFeed } from '../services/api';
import type { ActivityEvent, ActivityType } from '../types';

const typeIcons: Record<ActivityType, typeof Activity> = {
  scan: Search,
  stage_change: ArrowRightLeft,
  research: CheckCircle2,
  draft: PenLine,
  submission: Send,
};

const typeColors: Record<ActivityType, string> = {
  scan: '#059669',
  stage_change: '#6b7280',
  research: '#1d4ed8',
  draft: '#7c3aed',
  submission: '#d97706',
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export const ActivityFeed = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [showAll, setShowAll] = useState(false);

  const fetch = useCallback(async () => {
    const result = await getActivityFeed();
    if (result.success && result.data) {
      setEvents(result.data);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const visible = showAll ? events : events.slice(0, 5);

  if (events.length === 0) return null;

  return (
    <div className="activity-feed">
      <div className="activity-feed__header">
        <Activity size={14} style={{ color: 'var(--color-primary)' }} />
        <span>Recent Activity</span>
      </div>
      <div className="activity-feed__timeline">
        {visible.map((event, i) => {
          const Icon = typeIcons[event.type];
          const isLast = i === visible.length - 1;
          return (
            <div key={event.id} className="activity-feed__event">
              <div className="activity-feed__event-line">
                <div className="activity-feed__event-dot" style={{ backgroundColor: typeColors[event.type] }}>
                  <Icon size={10} color="#fff" />
                </div>
                {!isLast && <div className="activity-feed__event-connector" />}
              </div>
              <div className="activity-feed__event-body">
                <div className="activity-feed__event-title">{event.title}</div>
                <div className="activity-feed__event-detail">{event.detail}</div>
                <div className="activity-feed__event-footer">
                  {event.opportunityName && <span className="activity-feed__event-opp">{event.opportunityName}</span>}
                  <span className="activity-feed__event-time">{timeAgo(event.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {events.length > 5 && (
        <button className="activity-feed__toggle" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show less' : `Show ${events.length - 5} more`}
        </button>
      )}
    </div>
  );
};
