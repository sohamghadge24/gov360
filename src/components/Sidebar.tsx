"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  CheckSquare,
  BarChart,
  Settings,
  MapPin,
  ShieldAlert,
  Bell,
  Network,
  History,
  Archive,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

type NavGroup = {
  category: string;
  items: NavItem[];
};

const NAV_ITEMS: NavGroup[] = [
  {
    category: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Live Control Room", href: "/live", icon: Map },
    ]
  },
  {
    category: "WORKFORCE",
    items: [
      { name: "Attendance", href: "/attendance", icon: Clock },
      { name: "Employees", href: "/employees", icon: Users },
    ]
  },
  {
    category: "DUTY OPERATIONS",
    items: [
      { name: "Roster & Duty", href: "/roster", icon: Calendar },
      { name: "Verification", href: "/verification", icon: CheckCircle },
    ]
  },
  {
    category: "WORKFLOW",
    items: [
      { name: "Approvals", href: "/approvals", icon: CheckSquare },
    ]
  },
  {
    category: "INSIGHTS",
    items: [
      { name: "Reports & Analytics", href: "/reports", icon: BarChart },
    ]
  },
  {
    category: "ADMINISTRATION",
    items: [
      { name: "Organization", href: "/admin/organization", icon: Network },
      { name: "Locations & Geofences", href: "/admin/locations", icon: MapPin },
      { name: "Roles & Permissions", href: "/admin/roles", icon: ShieldAlert },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Integrations", href: "/admin/integrations", icon: Network },
      { name: "Audit Log", href: "/admin/audit", icon: History },
      { name: "Retention / Governance", href: "/admin/retention", icon: Archive },
    ]
  }
];

export default function Sidebar() {
  const currentPath = usePathname();

  return (
    <aside className="w-[250px] min-w-[250px] max-w-[250px] bg-white text-[var(--color-neutral)] flex flex-col h-full border-r border-[#E8EEF5] relative z-50">
      <div className="h-[72px] flex items-center justify-center px-4 border-b border-[#E8EEF5] shrink-0">
        <Logo variant="full" />
      </div>

      <div className="flex-1 overflow-y-auto py-5 custom-scrollbar">
        {NAV_ITEMS.map((group, i) => (
          <div key={i} className="mb-8">
            <h3 className="px-4 text-[9px] font-display font-medium text-[var(--color-neutral)]/80 uppercase tracking-[0.12em] mb-3">
              {group.category}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, j) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
                return (
                  <li key={j} className="relative px-3">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center justify-between px-3 h-[40px] rounded-[10px] transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] group overflow-hidden",
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-neutral)] hover:text-[var(--color-deep-navy)]"
                      )}
                    >
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="sidebar-active-bg"
                            className="absolute inset-0 bg-[var(--color-soft-blue)] rounded-[10px] z-0"
                            initial={false}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          />
                          <motion.div 
                            layoutId="sidebar-active-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--color-primary)] rounded-r-full z-10"
                            initial={false}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </>
                      )}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gray-50/0 group-hover:bg-gray-50 rounded-[10px] transition-colors duration-[300ms] z-0" />
                      )}
                      
                      <div className="flex items-center gap-[12px] relative z-10">
                        <Icon className={cn(
                          "w-[18px] h-[18px] transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive ? "text-[var(--color-primary)]" : "text-[var(--color-neutral)] group-hover:text-[var(--color-deep-navy)]"
                        )} />
                        <span className={isActive ? "font-display font-medium text-[12px] text-[var(--color-primary)]" : "font-display font-normal text-[12px] text-[var(--color-neutral)]"}>{item.name}</span>
                      </div>
                      
                      {item.badge && (
                        <span className="relative z-10 bg-[var(--color-soft-blue)] text-[var(--color-primary)] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-auto shrink-0 border-t border-[#E8EEF5] p-4">
        <Link 
          href="/settings"
          className="flex items-center gap-[12px] px-3 h-[40px] rounded-[10px] text-[12px] text-[var(--color-neutral)] hover:text-[var(--color-deep-navy)] hover:bg-gray-50 transition-all duration-[300ms] group"
        >
          <Settings className="w-[18px] h-[18px] text-[var(--color-neutral)] group-hover:text-[var(--color-deep-navy)] transition-colors" />
          <span className="font-display font-normal">Settings & Preferences</span>
        </Link>
      </div>
    </aside>
  );
}
