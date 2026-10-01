"use client";

import { useState } from "react";
import { Bell, HelpCircle, ChevronRight, ChevronDown, User, Shield, Settings, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { useToast } from "@/components/ui/ToastProvider";

const getBreadcrumb = (pathname: string) => {
  if (pathname === "/") return { category: "Operations", page: "Dashboard" };
  if (pathname === "/live-control-room") return { category: "Operations", page: "Live Control Room" };
  if (pathname === "/attendance") return { category: "Workforce", page: "Attendance" };
  if (pathname === "/employees") return { category: "Workforce", page: "Employees" };
  if (pathname === "/roster-duty") return { category: "Duty Operations", page: "Roster & Duty" };
  if (pathname === "/verification") return { category: "Duty Operations", page: "Verification" };
  if (pathname === "/approvals") return { category: "Workflow", page: "Approvals" };
  if (pathname === "/reports") return { category: "Insights", page: "Reports & Analytics" };
  if (pathname?.startsWith("/organization")) return { category: "Administration", page: "Organization" };
  if (pathname?.startsWith("/admin/locations")) return { category: "Administration", page: "Locations & Geofences" };
  if (pathname?.startsWith("/admin/roles")) return { category: "Administration", page: "Roles & Permissions" };
  if (pathname?.startsWith("/admin/notifications")) return { category: "Administration", page: "Notifications" };
  if (pathname?.startsWith("/admin/integrations")) return { category: "Administration", page: "Integrations" };
  if (pathname?.startsWith("/admin/audit")) return { category: "Administration", page: "Audit Log" };
  if (pathname?.startsWith("/admin/retention")) return { category: "Administration", page: "Retention / Governance" };
  if (pathname?.startsWith("/settings")) return { category: "Administration", page: "Settings & Preferences" };
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
    <header className="h-[76px] bg-transparent shrink-0 flex items-center justify-between px-10 z-40 relative">
      <div className="flex items-center text-[13px]">
        <span className="text-[var(--color-neutral)] font-medium tracking-wide">{bc.category}</span>
        <ChevronRight className="w-3.5 h-3.5 mx-3 text-[var(--color-neutral)]/60" />
        <span className="text-[var(--color-deep-navy)] font-bold tracking-wide">{bc.page}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <span className="text-[10px] font-bold text-green-700 tracking-[0.1em] uppercase">System Online</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
        </div>

        <div className="h-5 w-px bg-[var(--color-border)]"></div>

        <div className="flex items-center gap-2">
          <NotificationPopover />

          <button onClick={() => toast("Help Center", "Opening documentation & support portal.", "info")} className="text-[var(--color-neutral)] hover:text-[var(--color-deep-navy)] hover:bg-gray-100 p-2.5 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="h-5 w-px bg-[var(--color-border)]"></div>

        <div className="relative">
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-3.5 cursor-pointer hover:bg-gray-100 p-1.5 pr-3 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none border border-transparent hover:border-[var(--color-border)] group"
          >
            {authLoading ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] font-bold text-[12px] border border-[var(--color-border)] shadow-sm uppercase">
                  {user?.name ? user.name.substring(0, 2) : 'AU'}
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-[13px] font-bold text-[var(--color-deep-navy)]">{user?.name || 'Admin User'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-neutral)] group-hover:text-[var(--color-deep-navy)] transition-colors ml-1" />
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
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <User className="w-4 h-4 text-gray-400" /> My Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <Shield className="w-4 h-4 text-gray-400" /> Security & Sessions
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" /> Account Settings
                  </Link>
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[20px] shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="p-7">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 mb-5">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">Sign out of GovTrack360?</h2>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-8">
                You'll need to sign in again to access the Control Room and administrative features.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowLogoutModal(false);
                    await logout();
                    toast("Signed Out", "You've been signed out securely.", "success");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-[13px] font-semibold hover:bg-red-700 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 active:scale-[0.98] active:translate-y-0"
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
