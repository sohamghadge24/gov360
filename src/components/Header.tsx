"use client";

import { useState } from "react";
import { Bell, HelpCircle, ChevronRight, ChevronDown, User, Shield, Settings, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { useToast } from "@/components/ui/ToastProvider";

const getBreadcrumb = (pathname: string) => {
  if (pathname === "/") return { category: "Operations", page: "Dashboard" };
  if (pathname === "/live" || pathname === "/control-room") return { category: "Operations", page: "Live Control Room" };
  if (pathname === "/attendance") return { category: "Workforce", page: "Attendance" };
  if (pathname === "/employees") return { category: "Workforce", page: "Employees" };
  if (pathname === "/roster") return { category: "Duty Operations", page: "Roster & Duty" };
  if (pathname === "/verification") return { category: "Duty Operations", page: "Verification" };
  if (pathname === "/approvals") return { category: "Workflow", page: "Approvals" };
  if (pathname === "/reports") return { category: "Insights", page: "Reports & Analytics" };
  if (pathname?.startsWith("/admin/organization")) return { category: "Administration", page: "Organization" };
  if (pathname?.startsWith("/admin/locations")) return { category: "Administration", page: "Locations & Geofences" };
  if (pathname?.startsWith("/admin/roles")) return { category: "Administration", page: "Roles & Permissions" };
  if (pathname?.startsWith("/admin/notifications")) return { category: "Administration", page: "Notifications" };
  if (pathname?.startsWith("/admin/integrations")) return { category: "Administration", page: "Integrations" };
  if (pathname?.startsWith("/admin/audit")) return { category: "Administration", page: "Audit Log" };
  if (pathname?.startsWith("/admin/retention")) return { category: "Administration", page: "Retention / Governance" };
  return { category: "GovTrack360", page: "Admin" };
};

export default function Header() {
  const pathname = usePathname();
  const bc = getBreadcrumb(pathname);
  const { toast } = useToast();
  const { user, loading: authLoading, logout } = useAuth();
  
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <header className="h-16 border-b border-gray-200 bg-white shrink-0 flex items-center justify-between px-6 z-10 shadow-sm">
      <div className="flex items-center text-sm">
        <span className="text-gray-500 font-medium">{bc.category}</span>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-900 font-semibold">{bc.page}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-gray-700">System Online</span>
        </div>
        
        <div className="h-4 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-4">
          <NotificationPopover />
          
          <button onClick={() => toast("Help Center", "Opening documentation & support portal.", "info")} className="text-gray-500 hover:text-gray-900">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200"></div>
        
        <div className="relative">
          <button 
            onClick={() => setShowAccountMenu(!showAccountMenu)} 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-md transition-colors focus:outline-none"
          >
            {authLoading ? (
              <>
                <div className="flex flex-col items-end">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-end">
                  <div className="text-sm font-bold text-gray-900">{user?.name || 'Admin User'}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {user?.roles?.[0] || 'System Administrator'}
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 uppercase">
                  {user?.name ? user.name.substring(0, 2) : 'AU'}
                </div>
              </>
            )}
          </button>
          
          {showAccountMenu && user && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 uppercase shrink-0">
                       {user.name.substring(0, 2)}
                     </div>
                     <div className="min-w-0">
                       <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                       <div className="text-xs text-gray-500 truncate">{user.roles?.[0] || 'Administrator'}</div>
                     </div>
                   </div>
                   <div className="text-[11px] text-gray-400 truncate font-mono">{user.email}</div>
                </div>
                <div className="py-1">
                  <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <User className="w-4 h-4 text-gray-400" /> My Profile
                  </a>
                  <a href="/profile/security" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <Shield className="w-4 h-4 text-gray-400" /> Security & Sessions
                  </a>
                  <a href="/profile/settings" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" /> Account Settings
                  </a>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left">
                    <LogOut className="w-4 h-4 text-gray-400" /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Sign out of GovTrack360?</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                You'll need to sign in again to access the Control Room and administrative features.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    setShowLogoutModal(false);
                    await logout();
                    toast("Signed Out", "You've been signed out securely.", "success");
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
