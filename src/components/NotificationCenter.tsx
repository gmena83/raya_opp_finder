import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Search, Clock, CheckCircle2, PenLine, ArrowRightLeft, AlertTriangle, CheckCheck } from 'lucide-react';
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

type FilterTab = 'all' | 'deadline_warning' | 'research_complete' | 'draft_ready' | 'new_opportunity';

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deadline_warning', label: 'Deadlines' },
  { id: 'research_complete', label: 'Research' },
  { id: 'draft_ready', label: 'Drafts' },
  { id: 'new_opportunity', label: 'New Opps' },
];

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

function groupByDate(notifications: AppNotification[]): { label: string; items: AppNotification[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  const groups: Record<string, AppNotification[]> = { Today: [], Yesterday: [], Earlier: [] };
  for (const n of notifications) {
    const t = new Date(n.createdAt).getTime();
    if (t >= today) groups.Today.push(n);
    else if (t >= yesterday) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  }
  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: Props) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const result = await getNotifications();
    if (result.success && result.data) {
      setNotifications(result.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const groups = groupByDate(filtered);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="notif-center"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="notif-center__header">
              <div className="notif-center__header-top">
                <div>
                  <h2 className="notif-center__title">
                    <Bell size={16} /> Notifications
                    {unreadCount > 0 && <span className="notif-center__unread">{unreadCount}</span>}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {unreadCount > 0 && (
                    <button className="notif-center__mark-all" onClick={handleMarkAllRead}>
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                  <button onClick={onClose} className="detail-panel__close"><X size={18} /></button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="notif-center__filters">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`notif-center__filter ${activeFilter === tab.id ? 'notif-center__filter--active' : ''}`}
                    onClick={() => setActiveFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="notif-center__content">
              {isLoading ? (
                <div className="notif-center__loading">Loading notifications...</div>
              ) : filtered.length === 0 ? (
                <div className="notif-center__loading">No notifications in this category.</div>
              ) : (
                groups.map((group) => (
                  <div key={group.label} className="notif-center__group">
                    <div className="notif-center__group-label">{group.label}</div>
                    {group.items.map((n) => {
                      const Icon = typeIcons[n.type];
                      return (
                        <div
                          key={n.id}
                          className={`notif-center__item ${!n.isRead ? 'notif-center__item--unread' : ''}`}
                          style={{ borderLeftColor: urgencyColors[n.urgency] }}
                        >
                          <div className="notif-center__item-icon" style={{ backgroundColor: `${typeColors[n.type]}12`, color: typeColors[n.type] }}>
                            <Icon size={14} />
                          </div>
                          <div className="notif-center__item-body" onClick={() => handleMarkRead(n.id)}>
                            <div className="notif-center__item-title">{n.title}</div>
                            <div className="notif-center__item-message">{n.message}</div>
                            <div className="notif-center__item-footer">
                              <span className="notif-center__item-time">{timeAgo(n.createdAt)}</span>
                              {n.opportunityName && (
                                <span className="notif-center__item-opp">{n.opportunityName}</span>
                              )}
                            </div>
                          </div>
                          <button className="notif-center__dismiss" onClick={() => handleDismiss(n.id)} aria-label="Dismiss">
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
