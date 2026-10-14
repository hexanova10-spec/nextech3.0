import React, { useState } from 'react';
import { UserRole, NotificationItem } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mockStore';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  X,
  ArrowRight,
  Check
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  role: UserRole;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  role,
  onClose,
  onNavigateTab
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const roleNotifs = notifications.filter(
    (n) => n.recipientRole === role || n.recipientRole === 'student'
  );

  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleActionClick = (notif: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.actionUrl) {
      if (notif.actionUrl.includes('homework')) {
        onNavigateTab(role === 'teacher' ? 'teacher' : 'homework');
      } else if (notif.actionUrl.includes('camera')) {
        onNavigateTab('camera-alerts');
      } else if (notif.actionUrl.includes('reports')) {
        onNavigateTab(role === 'parent' ? 'parent' : 'teacher-reports');
      } else if (notif.actionUrl.includes('practice')) {
        onNavigateTab('practice');
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C1E16]/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-[#D5E9DC] flex flex-col justify-between">
        {/* Top Header */}
        <div className="p-5 border-b border-[#D5E9DC] flex items-center justify-between bg-[#F4FBF6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#006A4E] text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#18352A]">Notifications</h3>
              <span className="text-[10px] text-[#64776B] font-semibold">
                {unreadCount} unread • {role.toUpperCase()} Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-[#006A4E] hover:underline"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64776B] hover:text-[#18352A] hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {roleNotifs.length === 0 ? (
            <div className="text-center py-12 text-[#64776B] text-xs">
              No recent notifications for your role.
            </div>
          ) : (
            roleNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 text-xs ${
                  !n.read
                    ? 'bg-[#F4FBF6] border-[#006A4E]/40 shadow-xs'
                    : 'bg-white border-[#D5E9DC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-[#18352A] leading-tight">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[#64776B] shrink-0 font-medium">
                    {n.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-[#64776B] leading-relaxed">{n.message}</p>

                {n.actionLabel && (
                  <button
                    onClick={() => handleActionClick(n)}
                    className="text-[11px] font-bold text-[#006A4E] hover:text-[#004B38] flex items-center gap-1 pt-1"
                  >
                    <span>{n.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-[#D5E9DC] bg-[#F4FBF6] text-[10px] text-[#64776B] text-center">
          In-App notification channel active. External SMS/Email delivery requires registered school gateway.
        </div>
      </div>
    </div>
  );
};
