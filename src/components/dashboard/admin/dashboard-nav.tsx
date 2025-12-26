
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building,
  CreditCard,
  FileText,
  DollarSign,
  Landmark,
} from "lucide-react";
import { Logo } from "@/components/logo";

interface DashboardNavProps {
  isMobile?: boolean;
}

export function AdminNav({ isMobile = false }: DashboardNavProps) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  const adminNavLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/delegates", label: "Delegates", icon: Users },
    { href: "/dashboard/admin/committees", label: "Committees", icon: Landmark },
    { href: "/dashboard/admin/payments", label: "Payments", icon: DollarSign },
    { href: "/dashboard/admin/cms", label: "CMS", icon: FileText },
  ];

  const delegateNavLinks = [
    { href: "/dashboard/delegate", label: "Dashboard", icon: LayoutDashboard },
    // Add more delegate links here if needed
  ];

  const navLinks = isAdmin ? adminNavLinks : delegateNavLinks;

  const navContent = (
    <nav className="grid items-start gap-2 text-sm font-medium">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            {
              "bg-muted text-primary": pathname === link.href,
            }
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );

  if (isMobile) {
    return <div className="p-4">{navContent}</div>;
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block fixed h-full w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-auto py-2">
          {navContent}
        </div>
      </div>
    </div>
  );
}
