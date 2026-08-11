"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  MessageSquareText,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/requests",
    label: "Requests",
    icon: ClipboardList,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/properties",
    label: "Properties",
    icon: Building2,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: MessageSquareText,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 border-r bg-background p-4 md:block">
      <div className="mb-6 px-3">
        <h2 className="text-xl font-semibold">Admin Panel</h2>

        <p className="text-sm text-muted-foreground">Manage RentNest</p>
      </div>

      <nav className="space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
