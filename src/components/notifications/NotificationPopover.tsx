import React, { useState, useEffect, useRef } from "react";
import { Bell, Clock, CheckCircle, AlertTriangle, Settings, Shield, BadgeCheck, Briefcase } from "lucide-react";
import { notificationService, Notification } from "@/api/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Only load initial when first mounted
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res?.data) {
        setNotifications(res.data.slice(0, 5)); // Only show top 5 in popover
        setUnreadCount(res.data.filter(n => !n.read).length); // Fake count based on first fetch, real impl would use metadata
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'attendance': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'verification': return <BadgeCheck className="w-4 h-4 text-indigo-500" />;
      case 'duty': return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'exception': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'approval': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'security': return <Shield className="w-4 h-4 text-red-500" />;
      default: return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }} 
        className="text-gray-500 hover:text-gray-900 relative p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} unread</span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">You're all caught up</h4>
                <p className="text-xs text-gray-500">No new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors group ${!n.read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/notifications');
                    }}
                  >
                    <div className="mt-0.5 relative shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!n.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {getIcon(n.type)}
                      </div>
                      {!n.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm mb-0.5 truncate ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {n.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-1.5 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] font-medium text-gray-400">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 p-2 bg-gray-50/50">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View all notifications &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
