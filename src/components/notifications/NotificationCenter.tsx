"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, AlertTriangle, Settings, Shield, 
  BadgeCheck, Briefcase, Clock, Search, ChevronRight, X
} from "lucide-react";
import { notificationService, Notification } from "@/api/notifications";

export const NotificationCenter = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  // Fake summary values for UI
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentCount = notifications.length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (loadMore = false) => {
    if (loadMore) setLoadingMore(true);
    else setLoading(true);
    
    setError(null);
    try {
      const currentCursor = loadMore ? cursor : undefined;
      const res = await notificationService.getNotifications(currentCursor);
      
      if (res?.data) {
        if (loadMore) {
          setNotifications(prev => [...prev, ...res.data]);
        } else {
          setNotifications(res.data);
        }
        setCursor(res.nextCursor);
        setHasMore(!!res.nextCursor);
      }
    } catch (err) {
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      if (selectedNotification?.id === id) {
        setSelectedNotification({ ...selectedNotification, read: true });
      }
      await notificationService.markAsRead(id);
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'attendance': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'verification': return <BadgeCheck className="w-5 h-5 text-indigo-500" />;
      case 'duty': return <Briefcase className="w-5 h-5 text-emerald-500" />;
      case 'exception': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'approval': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'security': return <Shield className="w-5 h-5 text-red-500" />;
      default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  // Filter local logic for UX demo (in real app, pass filter to API)
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {!hideHeader && (
        <div className="mb-6 px-6 pt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-500">Manage operational alerts, reminders, broadcasts and notification delivery.</p>
        </div>
      )}

      {/* Top Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-6 pt-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Notifications</h3>
          <p className="text-2xl font-bold text-gray-900">{recentCount}</p>
          <p className="text-xs text-gray-400 mt-1">Recent activity</p>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm bg-blue-50/30">
          <h3 className="text-sm font-semibold text-blue-600 mb-2">Unread</h3>
          <p className="text-2xl font-bold text-blue-700">{unreadCount}</p>
          <p className="text-xs text-blue-500 mt-1">Requires attention</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Delivery Status</h3>
          <p className="text-2xl font-bold text-gray-900">Active</p>
          <p className="text-xs text-gray-400 mt-1">Operational</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mx-6 mb-6">
        {/* Filters */}
        <div className="flex items-center justify-between border-b border-gray-200 px-2 overflow-x-auto bg-gray-50/50 shrink-0">
          <div className="flex">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${filter === f ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="pr-4">
            <button 
              onClick={() => fetchNotifications(false)}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <Settings className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 bg-gray-100 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
              <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
              <p className="text-gray-900 font-medium mb-1">Unable to load notifications</p>
              <p className="text-gray-500 text-sm mb-6">We couldn't retrieve your notification inbox.</p>
              <button onClick={() => fetchNotifications()} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm font-medium hover:bg-gray-50">Retry</button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center h-full min-h-[300px]">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">You're all caught up</h3>
              <p className="text-gray-500">No new notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(n => (
                <div 
                  key={n.id}
                  onClick={() => setSelectedNotification(n)}
                  className={`p-4 flex gap-4 transition-colors hover:bg-gray-50 group cursor-pointer ${!n.read ? 'bg-blue-50/20' : 'bg-white'}`}
                >
                  <div className="shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!n.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getIcon(n.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-0.5">
                      <div className="flex items-center gap-2">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>}
                        <h4 className={`text-[15px] truncate ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {n.title}
                        </h4>
                      </div>
                      <span className={`text-xs whitespace-nowrap pt-0.5 ${!n.read ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className={`text-[14px] leading-relaxed mb-2 pl-${!n.read ? '4' : '0'} ${!n.read ? 'text-gray-800' : 'text-gray-500'}`}>
                      {n.message}
                    </p>
                    
                    <div className={`flex items-center justify-between pl-${!n.read ? '4' : '0'}`}>
                      <span className="text-[12px] font-medium text-gray-500 capitalize">
                        {n.type || 'System'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {hasMore && (
                <div className="p-6 text-center border-t border-gray-100">
                  <button 
                    onClick={() => fetchNotifications(true)}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white shadow-xl w-full max-w-md h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Notification</h2>
              <button onClick={() => setSelectedNotification(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!selectedNotification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{selectedNotification.title}</h3>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100 text-[14px] text-gray-800 leading-relaxed">
                {selectedNotification.message}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Received</h4>
                  <p className="text-sm text-gray-900 font-medium">{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</h4>
                  <p className="text-sm text-gray-900 font-medium capitalize">{selectedNotification.type || 'System'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {!selectedNotification.read ? (
                      <><div className="w-2 h-2 rounded-full bg-blue-600"></div><span className="text-blue-700">Unread</span></>
                    ) : (
                      <span className="text-gray-600">Read</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
              {!selectedNotification.read ? (
                <button 
                  onClick={(e) => handleMarkRead(e, selectedNotification.id)}
                  className="w-full py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center"
                >
                  Mark as read
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-center"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
