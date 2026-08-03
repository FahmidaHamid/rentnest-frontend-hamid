// src/app/admin/layout.tsx

import type { ReactNode } from "react";

import RoleGuard from "@/components/shared/RoleGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto flex max-w-7xl">
          <AdminSidebar />

          <main className="min-w-0 flex-1 p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
