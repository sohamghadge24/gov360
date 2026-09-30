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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          GovTrack360
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {NAV_ITEMS.map((group, i) => (
          <div key={i} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.category}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item, j) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
                return (
                  <li key={j} className="relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-6 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group",
                        isActive
                          ? "bg-blue-600/10 text-blue-400"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 hover:translate-x-1"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "w-4 h-4 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive ? "text-blue-500" : "text-slate-500 group-hover:text-blue-400"
                        )} />
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded transition-transform duration-300 group-hover:scale-105">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    {/* Animated Indicator */}
                    <div className={cn(
                      "absolute right-0 top-1 bottom-1 w-[3px] rounded-l-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive ? "bg-blue-500 scale-y-100" : "bg-blue-500/0 scale-y-0 group-hover:bg-slate-600 group-hover:scale-y-50"
                    )} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
