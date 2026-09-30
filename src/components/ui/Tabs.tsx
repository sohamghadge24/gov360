"use client";

import React, { useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export type TabItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
};

export interface TabsProps {
  tabs: TabItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  variant?: "line" | "pill";
  className?: string;
  tabClassName?: string;
}

export function Tabs({ tabs, activeId, onChange, variant = "line", className, tabClassName }: TabsProps) {
  const pathname = usePathname();
  const tabsId = useId();

  return (
    <nav 
      className={clsx(
        "flex overflow-x-auto relative scrollbar-hide", 
        variant === "line" ? "border-b border-gray-200 space-x-2" : "bg-gray-100/80 border border-gray-200/60 p-1 rounded-xl gap-1",
        className
      )} 
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        // Resolve active state (href-based routing vs explicit activeId)
        const isActive = tab.href
          ? pathname === tab.href || (pathname !== '/' && pathname.startsWith(tab.href + '/'))
          : activeId === tab.id;

        const baseClasses = clsx(
          "relative z-10 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group outline-none active:scale-[0.985]",
          variant === "line" ? "px-4 py-3 rounded-t-sm" : "flex-1 px-4 py-2.5 rounded-lg",
          tabClassName
        );

        const activeClasses = "text-blue-700";
        const inactiveClasses = "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50 hover:shadow-[0_1px_2px_rgba(0,0,0,0.02)]";

        const content = (
          <>
            {/* Background Animations */}
            {isActive && variant === "pill" && (
              <motion.div
                layoutId={`pill-bg-${tabsId}`}
                className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200/50 rounded-lg z-0"
                initial={false}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            
            {isActive && variant === "line" && (
              <motion.div
                layoutId={`line-bg-${tabsId}`}
                className="absolute inset-0 bg-blue-50/50 rounded-t-md z-0"
                initial={false}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            
            {/* Active Line Indicator */}
            {isActive && variant === "line" && (
              <motion.div
                layoutId={`line-indicator-${tabsId}`}
                className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-blue-600 z-20"
                initial={false}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            {/* Icon & Label */}
            {tab.icon && (
              <tab.icon className={clsx(
                "w-4 h-4 relative z-10 transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]", 
                isActive ? 'text-blue-600 -translate-y-[1px]' : 'text-gray-400 group-hover:text-blue-500'
              )} />
            )}
            <span className={clsx(
              "relative z-10 transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isActive ? "font-semibold" : ""
            )}>
              {tab.label}
            </span>
          </>
        );

        if (tab.href) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={clsx(baseClasses, isActive ? activeClasses : inactiveClasses)}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            className={clsx(baseClasses, isActive ? activeClasses : inactiveClasses)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
