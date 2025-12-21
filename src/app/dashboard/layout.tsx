'use client';

import { usePathname } from 'next/navigation';
import { DelegateHeader } from '@/components/dashboard/delegate/delegate-header';
import { DelegateNav } from '@/components/dashboard/delegate/delegate-nav';
import { AdminHeader } from '@/components/dashboard/admin/dashboard-header';
import { AdminNav } from '@/components/dashboard/admin/dashboard-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/dashboard/admin');

    if (isAdmin) {
        return (
            <div className="min-h-screen w-full flex">
                <AdminNav />
                <div className="flex flex-col w-full md:ml-64">
                    <AdminHeader />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // Default to delegate layout
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <DelegateNav />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <DelegateHeader />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
