import type { ReactNode } from "react";

import RoleGuard from "@/components/shared/RoleGuard";

type TenantLayoutProps = {
  children: ReactNode;
};

export default function TenantLayout({ children }: TenantLayoutProps) {
  return <RoleGuard allowedRoles={["TENANT"]}>{children}</RoleGuard>;
}
