import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Search, Clock, CheckCircle2, PenLine, ArrowRightLeft, AlertTriangle, CheckCheck, X } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllRead } from '../services/api';
import type { AppNotification, NotificationType } from '../types';

const typeIcons: Record<NotificationType, typeof Bell> = {
  new_opportunity: Search,
  deadline_warning: Clock,
  research_complete: CheckCircle2,
  draft_ready: PenLine,
  stage_update: ArrowRightLeft,
  missing_data_alert: AlertTriangle,
};

const typeColors: Record<NotificationType, string> = {
  new_opportunity: '#059669',
  deadline_warning: '#d97706',
  research_complete: '#1d4ed8',
  draft_ready: '#7c3aed',
  stage_update: '#6b7280',
  missing_data_alert: '#dc2626',
};

const urgencyColors = { low: '#6b7280', medium: '#d97706', high: '#dc2626' };

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

interface Props {
  onOpenCenter: () => void;
}

export const NotificationBell = ({ onOpenCenter }: Props) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    const result = await getNotifications();
    if (result.success && result.data) {
      setNotifications(result.data);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="notif-bell" ref={dropdownRef}>
      <button
        className="notif-bell__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notif-bell__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-bell__dropdown">
          {/* Header */}
          <div className="notif-bell__dropdown-header">
            <span className="notif-bell__dropdown-title">
              Notifications {unreadCount > 0 && <span className="notif-bell__unread-count">({unreadCount} new)</span>}
            </span>
            {unreadCount > 0 && (
              <button className="notif-bell__mark-all" onClick={handleMarkAllRead}>
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="notif-bell__list">
            {recentNotifications.length === 0 ? (
              <div className="notif-bell__empty">No notifications yet.</div>
            ) : (
              recentNotifications.map((n) => {
                const Icon = typeIcons[n.type];
                return (
                  <div
                    key={n.id}
                    className={`notif-bell__item ${!n.isRead ? 'notif-bell__item--unread' : ''}`}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <div className="notif-bell__item-icon" style={{ backgroundColor: `${typeColors[n.type]}12`, color: typeColors[n.type] }}>
                      <Icon size={13} />
                    </div>
                    <div className="notif-bell__item-body">
                      <div className="notif-bell__item-title">{n.title}</div>
                      <div className="notif-bell__item-message">{n.message}</div>
                      <div className="notif-bell__item-time">{timeAgo(n.createdAt)}</div>
                    </div>
                    <div className="notif-bell__item-urgency" style={{ backgroundColor: urgencyColors[n.urgency] }} />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <button className="notif-bell__view-all" onClick={() => { setIsOpen(false); onOpenCenter(); }}>
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};
