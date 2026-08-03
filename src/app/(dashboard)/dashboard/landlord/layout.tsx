import type { ReactNode } from "react";

import RoleGuard from "@/components/shared/RoleGuard";

type LandlordLayoutProps = {
  children: ReactNode;
};

export default function LandlordLayout({ children }: LandlordLayoutProps) {
  return <RoleGuard allowedRoles={["LANDLORD"]}>{children}</RoleGuard>;
}
