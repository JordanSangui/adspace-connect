"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import type { UserRole } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Derive initial role from current path
  const getInitialRole = (): UserRole => {
    if (pathname.startsWith("/dashboard/agency")) return "agency";
    if (pathname.startsWith("/dashboard/moderator")) return "moderator";
    return "owner";
  };

  const [role, setRole] = useState<UserRole>(getInitialRole);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "owner") router.push("/dashboard/owner");
    else if (newRole === "agency") router.push("/dashboard/agency");
    else router.push("/dashboard/moderator");
  };

  // Sync role with pathname changes
  useEffect(() => {
    if (pathname.startsWith("/dashboard/agency")) setRole("agency");
    else if (pathname.startsWith("/dashboard/moderator")) setRole("moderator");
    else if (pathname.startsWith("/dashboard/owner")) setRole("owner");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar role={role} onRoleChange={handleRoleChange} />
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
