import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  Clock, 
  X, 
  MailOpen, 
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Notifications() {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold tracking-tight text-2xl text-gray-900 dark:text-white">
            Workspace Notifications
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Historical log of collection creations, favorited developers, and workspace mutations.
          </p>
        </div>

        {/* Global Controls */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-blue-100 bg-blue-50/50 hover:bg-blue-100/50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-400 transition-colors"
                id="notifications-mark-all-btn"
              >
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </button>
            )}

            <button
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-red-100 bg-red-50/50 hover:bg-red-100/50 text-red-600 dark:border-red-950/20 dark:text-red-400 transition-colors"
              id="notifications-clear-all-btn"
            >
              <Trash2 className="w-4 h-4" /> Clear Log
            </button>
          </div>
        )}
      </div>

      {/* Notifications List container */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Clean Notification Log</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Your log is currently empty. Whenever you perform actions like adding items to collections or saving favorites, alerts will show here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800" id="notifications-list-items">
            {notifications.map((not) => (
              <div
                key={not.id}
                onClick={() => {
                  if (!not.isRead) markNotificationAsRead(not.id);
                }}
                className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  not.isRead 
                    ? 'bg-white dark:bg-gray-900' 
                    : 'bg-blue-50/20 dark:bg-blue-950/10 hover:bg-blue-50/40'
                }`}
              >
                <div className="flex gap-3.5 min-w-0">
                  {/* Icon depending on Read status */}
                  <div className={`p-2 rounded-xl border mt-0.5 ${
                    not.isRead
                      ? 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-750 text-gray-400'
                      : 'bg-blue-50 border-blue-100 dark:bg-blue-950 dark:border-blue-900 text-blue-600 dark:text-blue-400'
                  }`}>
                    {not.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-sans text-xs truncate ${not.isRead ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-950 dark:text-white font-bold'}`}>
                        {not.title}
                      </span>
                      {!not.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {not.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2.5 text-[9px] text-gray-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(not.createdAt).toLocaleDateString()} {new Date(not.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Individual Control buttons */}
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {!not.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(not.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                      title="Mark as Read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(not.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    title="Delete Record"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
